<?php

namespace App\Http\Controllers;

use App\Models\Subtask;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Return all tasks (with subtasks) for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $tasks = $request->user()
            ->tasks()
            ->with('subtasks')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn(Task $task) => $this->formatTask($task));

        return response()->json($tasks);
    }

    /**
     * Create a new task (with optional subtasks).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'in:todo,in_progress,completed',
            'priority'    => 'in:low,medium,high',
            'due_date'    => 'nullable|date',
            'complexity'  => 'integer|min:1|max:5',
            'effort'      => 'integer|min:1|max:5',
            'importance'  => 'integer|min:1|max:5',
            'subtasks'    => 'array',
            'subtasks.*.title'     => 'required|string',
            'subtasks.*.completed' => 'boolean',
        ]);

        $task = $request->user()->tasks()->create([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status'      => $validated['status'] ?? 'todo',
            'priority'    => $validated['priority'] ?? 'medium',
            'due_date'    => $validated['due_date'] ?? null,
            'complexity'  => $validated['complexity'] ?? 3,
            'effort'      => $validated['effort'] ?? 3,
            'importance'  => $validated['importance'] ?? 3,
        ]);

        // Create subtasks if provided
        if (!empty($validated['subtasks'])) {
            foreach ($validated['subtasks'] as $subtaskData) {
                $task->subtasks()->create([
                    'title'     => $subtaskData['title'],
                    'completed' => $subtaskData['completed'] ?? false,
                ]);
            }
        }

        $task->load('subtasks');

        return response()->json($this->formatTask($task), 201);
    }

    /**
     * Update an existing task and its subtasks.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $task = $request->user()->tasks()->findOrFail($id);

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'sometimes|in:todo,in_progress,completed',
            'priority'    => 'sometimes|in:low,medium,high',
            'due_date'    => 'nullable|date',
            'complexity'  => 'sometimes|integer|min:1|max:5',
            'effort'      => 'sometimes|integer|min:1|max:5',
            'importance'  => 'sometimes|integer|min:1|max:5',
            'subtasks'    => 'sometimes|array',
            'subtasks.*.id'        => 'nullable|integer',
            'subtasks.*.title'     => 'required|string',
            'subtasks.*.completed' => 'boolean',
        ]);

        $task->update(array_filter([
            'title'       => $validated['title'] ?? null,
            'description' => array_key_exists('description', $validated) ? $validated['description'] : null,
            'status'      => $validated['status'] ?? null,
            'priority'    => $validated['priority'] ?? null,
            'due_date'    => array_key_exists('due_date', $validated) ? $validated['due_date'] : null,
            'complexity'  => $validated['complexity'] ?? null,
            'effort'      => $validated['effort'] ?? null,
            'importance'  => $validated['importance'] ?? null,
        ], fn($v) => $v !== null));

        // Sync subtasks if provided
        if (isset($validated['subtasks'])) {
            $existingIds = $task->subtasks()->pluck('id')->toArray();
            $incomingIds = array_filter(array_column($validated['subtasks'], 'id'));

            // Delete removed subtasks
            $toDelete = array_diff($existingIds, $incomingIds);
            if (!empty($toDelete)) {
                $task->subtasks()->whereIn('id', $toDelete)->delete();
            }

            // Upsert subtasks
            foreach ($validated['subtasks'] as $subtaskData) {
                if (!empty($subtaskData['id'])) {
                    Subtask::where('id', $subtaskData['id'])
                        ->where('task_id', $task->id)
                        ->update([
                            'title'     => $subtaskData['title'],
                            'completed' => $subtaskData['completed'] ?? false,
                        ]);
                } else {
                    $task->subtasks()->create([
                        'title'     => $subtaskData['title'],
                        'completed' => $subtaskData['completed'] ?? false,
                    ]);
                }
            }
        }

        $task->load('subtasks');

        return response()->json($this->formatTask($task));
    }

    /**
     * Delete a task (subtasks cascade via DB).
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $task = $request->user()->tasks()->findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted.']);
    }

    /**
     * Workload aggregation: tasks per weekday grouped by status.
     */
    public function workload(Request $request): JsonResponse
    {
        $tasks = $request->user()->tasks()->get();

        $days = [
            0 => 'Sun', 1 => 'Mon', 2 => 'Tue',
            3 => 'Wed', 4 => 'Thu', 5 => 'Fri', 6 => 'Sat',
        ];

        // Map in Mon–Sun order for frontend
        $orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        $workload = [];
        foreach ($orderedDays as $dayName) {
            $dayIndex = array_search($dayName, $days);

            $dayTasks = $tasks->filter(function (Task $task) use ($dayIndex, $dayName) {
                if (!$task->due_date) {
                    return $dayName === 'Wed'; // undated tasks → Wednesday
                }
                return (int) $task->due_date->dayOfWeek === (int) $dayIndex;
            });

            $workload[] = [
                'day'        => $dayName,
                'todo'       => $dayTasks->where('status', 'todo')->count(),
                'inProgress' => $dayTasks->where('status', 'in_progress')->count(),
                'completed'  => $dayTasks->where('status', 'completed')->count(),
            ];
        }

        return response()->json($workload);
    }

    /**
     * Format a Task model to match the frontend Task interface.
     */
    private function formatTask(Task $task): array
    {
        return [
            'id'          => (string) $task->id,
            'title'       => $task->title,
            'description' => $task->description,
            'status'      => $task->status,
            'priority'    => $task->priority,
            'dueDate'     => $task->due_date?->format('Y-m-d'),
            'createdAt'   => $task->created_at->toISOString(),
            'complexity'  => $task->complexity,
            'effort'      => $task->effort,
            'importance'  => $task->importance,
            'subtasks'    => $task->subtasks->map(fn(Subtask $s) => [
                'id'        => (string) $s->id,
                'title'     => $s->title,
                'completed' => (bool) $s->completed,
            ])->toArray(),
        ];
    }
}
