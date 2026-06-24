<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

// ── Public Auth Routes ──────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

// ── Protected Routes (require valid Sanctum token) ─────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'me']);

    // Tasks
    Route::get('/tasks',          [TaskController::class, 'index']);
    Route::post('/tasks',         [TaskController::class, 'store']);
    Route::put('/tasks/{id}',     [TaskController::class, 'update']);
    Route::delete('/tasks/{id}',  [TaskController::class, 'destroy']);

    // Workload aggregation
    Route::get('/workload', [TaskController::class, 'workload']);
});
