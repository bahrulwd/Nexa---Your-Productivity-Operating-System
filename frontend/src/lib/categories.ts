export interface CategoryConfig {
  name: string;
  icon: string;
  bgColor: string;
  textColor: string;
  keywords: string[];
}

export const getDashboardCategories = (role: string): CategoryConfig[] => {
  const roleLower = role.toLowerCase();
  
  // 1. Tech & Dev
  if (roleLower.includes('dev') || roleLower.includes('engineer') || roleLower.includes('program') || roleLower.includes('code') || roleLower.includes('tech') || roleLower.includes('coder') || roleLower.includes('web') || roleLower.includes('it')) {
    return [
      {
        name: 'Feature Dev',
        icon: 'fa-solid fa-terminal',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-500',
        keywords: ['dev', 'code', 'implement', 'feature', 'build', 'frontend', 'backend', 'api', 'function', 'make', 'create']
      },
      {
        name: 'Testing & Bugfix',
        icon: 'fa-solid fa-bug-slash',
        bgColor: 'bg-red-50',
        textColor: 'text-red-500',
        keywords: ['test', 'bug', 'fix', 'debug', 'refactor', 'audit', 'check', 'error', 'verify', 'resolve']
      },
      {
        name: 'Setup & Tech Specs',
        icon: 'fa-solid fa-gears',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-500',
        keywords: ['setup', 'config', 'deploy', 'database', 'server', 'migrate', 'npm', 'git', 'install', 'spec']
      }
    ];
  }
  
  // 2. Design & Creative
  if (roleLower.includes('design') || roleLower.includes('art') || roleLower.includes('creative') || roleLower.includes('illustrator') || roleLower.includes('ui') || roleLower.includes('ux') || roleLower.includes('architect') || roleLower.includes('artist')) {
    return [
      {
        name: 'Desain & Visual',
        icon: 'fa-solid fa-palette',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-500',
        keywords: ['design', 'ui', 'ux', 'layout', 'wireframe', 'mockup', 'color', 'palette', 'illustration', 'draw', 'sketch']
      },
      {
        name: 'Prototyping',
        icon: 'fa-solid fa-wand-magic-sparkles',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-500',
        keywords: ['prototype', 'flow', 'figma', 'interactive', 'motion', 'animation', 'transition', 'present']
      },
      {
        name: 'Riset & Inspirasi',
        icon: 'fa-solid fa-lightbulb',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-500',
        keywords: ['moodboard', 'research', 'inspiration', 'reference', 'benchmark', 'audit', 'analyze', 'search', 'find']
      }
    ];
  }
  
  // 3. Writer & Marketing & Content
  if (roleLower.includes('write') || roleLower.includes('copy') || roleLower.includes('content') || roleLower.includes('market') || roleLower.includes('seo') || roleLower.includes('social') || roleLower.includes('penulis') || roleLower.includes('jurnal') || roleLower.includes('media') || roleLower.includes('iklan')) {
    return [
      {
        name: 'Drafting/Writing',
        icon: 'fa-solid fa-pen-nib',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-500',
        keywords: ['write', 'draft', 'copy', 'artikel', 'naskah', 'penulisan', 'blog', 'script', 'tulis', 'bikin']
      },
      {
        name: 'Editing & SEO',
        icon: 'fa-solid fa-magnifying-glass-chart',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-500',
        keywords: ['edit', 'proofread', 'review', 'seo', 'keyword', 'optimize', 'revisi', 'perbaikan', 'check']
      },
      {
        name: 'Riset & Strategi',
        icon: 'fa-solid fa-chart-line',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-500',
        keywords: ['research', 'riset', 'analytics', 'competitor', 'strategy', 'plan', 'audit', 'ide', 'campaign']
      }
    ];
  }
  
  // 4. Student & Education
  if (roleLower.includes('student') || roleLower.includes('mahasiswa') || roleLower.includes('siswa') || roleLower.includes('akadem') || roleLower.includes('dosen') || roleLower.includes('teacher') || roleLower.includes('belajar') || roleLower.includes('school') || roleLower.includes('college') || roleLower.includes('kuliah')) {
    return [
      {
        name: 'Tugas/Assignment',
        icon: 'fa-solid fa-book-open',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-500',
        keywords: ['tugas', 'assignment', 'homework', 'pr', 'projek', 'project', 'laporan', 'paper', 'quiz']
      },
      {
        name: 'Belajar/Study',
        icon: 'fa-solid fa-graduation-cap',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-500',
        keywords: ['belajar', 'study', 'read', 'baca', 'materi', 'kuliah', 'exam', 'ujian', 'practice', 'course']
      },
      {
        name: 'Riset/Thesis',
        icon: 'fa-solid fa-flask',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-500',
        keywords: ['research', 'riset', 'thesis', 'skripsi', 'jurnal', 'audit', 'analisis', 'data', 'survey']
      }
    ];
  }
  
  // 5. Default General / Management / Founders / Others
  return [
    {
      name: 'Rencana & Strategi',
      icon: 'fa-solid fa-compass',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-500',
      keywords: ['plan', 'strategy', 'roadmap', 'meeting', 'pitch', 'proposal', 'business', 'financial', 'budget']
    },
    {
      name: 'Eksekusi Kerja',
      icon: 'fa-solid fa-list-check',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-500',
      keywords: ['implement', 'build', 'execute', 'run', 'operasional', 'task', 'tugas', 'kerja', 'handle', 'do']
    },
    {
      name: 'Riset & Analisis',
      icon: 'fa-solid fa-chart-simple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-500',
      keywords: ['research', 'riset', 'audit', 'analyze', 'review', 'competitor', 'data', 'feedback', 'study']
    }
  ];
};

export const getTaskCategory = (taskTitle: string, categories: CategoryConfig[]): string => {
  const title = taskTitle;
  
  // Check for exact bracketed category tag first (e.g. "[Feature Dev]")
  for (const cat of categories) {
    if (title.includes(`[${cat.name}]`)) {
      return cat.name;
    }
  }
  
  // Fall back to keyword matching
  const titleLower = title.toLowerCase();
  for (const cat of categories) {
    if (cat.keywords.some((kw) => titleLower.includes(kw))) {
      return cat.name;
    }
  }
  
  return 'Umum';
};

export const getGeneralCategory = (taskTitle: string): string => {
  const title = taskTitle;
  if (title.includes('[Pekerjaan]')) return 'Pekerjaan';
  if (title.includes('[Belajar]')) return 'Belajar';
  if (title.includes('[Pribadi]')) return 'Pribadi';
  if (title.includes('[Lainnya]')) return 'Lainnya';
  
  // Fallbacks based on keywords if prefix is missing
  const titleLower = title.toLowerCase();
  if (titleLower.includes('kerja') || titleLower.includes('work') || titleLower.includes('job') || titleLower.includes('projek') || titleLower.includes('project') || titleLower.includes('client') || titleLower.includes('dev') || titleLower.includes('design')) return 'Pekerjaan';
  if (titleLower.includes('belajar') || titleLower.includes('study') || titleLower.includes('kuliah') || titleLower.includes('baca') || titleLower.includes('learn')) return 'Belajar';
  if (titleLower.includes('pribadi') || titleLower.includes('personal') || titleLower.includes('belanja') || titleLower.includes('makan') || titleLower.includes('olahraga')) return 'Pribadi';
  
  return 'Lainnya';
};

export const getUserRole = (): string => {
  const settingsStr = localStorage.getItem('nexa_settings');
  if (settingsStr) {
    try {
      const parsed = JSON.parse(settingsStr);
      if (parsed.role) return parsed.role;
    } catch {}
  }
  return 'Founder';
};
