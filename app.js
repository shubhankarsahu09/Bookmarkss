/**
 *  AeroMark Pro — Spatial Liquid Glass Bookmark Hub
 * Advanced Architecture: 3D Cursor Sheen, Drag & Drop Reordering,
 * Web Audio Haptics, Browser HTML Import, and 100x Enhanced Smart Popups.
 */

(function () {
  'use strict';

  // Storage Keys (v10 with user's exact collection)
  const STORAGE_KEY_BOOKMARKS = 'aeromark_user_bookmarks_v10';
  const STORAGE_KEY_CATEGORIES = 'aeromark_user_categories_v10';
  const STORAGE_KEY_THEME = 'aeromark_pro_theme_v3';
  const STORAGE_KEY_LAYOUT = 'aeromark_pro_layout_v3';
  const STORAGE_KEY_SOUND = 'aeromark_pro_sound_v3';

  // Safe Storage Helper (Guards against file:// restrictions and privacy mode errors)
  const SafeStorage = {
    get(key, fallback) {
      try {
        const val = localStorage.getItem(key);
        return val !== null ? val : fallback;
      } catch {
        return fallback;
      }
    },
    getJSON(key, fallback) {
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, val) {
      try {
        localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
      } catch (e) {
        console.warn('Storage save failed:', e);
      }
    }
  };

  // Utility to prevent XSS
  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return text.toString().replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

  // Exact 13 User Categories
  const USER_CATEGORIES = [
    {
      id: "cat-1780314788048",
      name: "Github",
      icon: "💻",
      color: "#34c759"
    },
    {
      id: "cat-1780321855566",
      name: "Designing",
      icon: "🎥",
      color: "#0071e3"
    },
    {
      id: "cat-1780322087880",
      name: "Social Media",
      icon: "📱",
      color: "#ff2d55"
    },
    {
      id: "cat-1780322315825",
      name: "Ai Related",
      icon: "💗",
      color: "#af52de"
    },
    {
      id: "cat-1780322386583",
      name: "Ai Automation",
      icon: "🔥",
      color: "#ff9500"
    },
    {
      id: "cat-1780322533475",
      name: "Chatbots",
      icon: "🤝",
      color: "#ff3b30"
    },
    {
      id: "cat-1780322606889",
      name: "My works",
      icon: "👍",
      color: "#0071e3"
    },
    {
      id: "cat-1780322883192",
      name: "Shopping",
      icon: "💰",
      color: "#af52de"
    },
    {
      id: "cat-1780322994355",
      name: "Database & Development",
      icon: "😶",
      color: "#8e8e93"
    },
    {
      id: "cat-1782223837069",
      name: "Editing",
      icon: "🙌",
      color: "#ff2d55"
    },
    {
      id: "cat-1784969507221",
      name: "buisness",
      icon: "🙃",
      color: "#0071e3"
    },
    {
      id: "cat-1784969596224",
      name: "study",
      icon: "📕",
      color: "#ff3b30"
    },
    {
      id: "cat-1784969706339",
      name: "hacking'",
      "icon": "🙌",
      color: "#0071e3"
    }
  ];

  // Exact 37 User Bookmarks
  const USER_BOOKMARKS_RAW = [
    {
      id: "bm-imp-1781075300307-123",
      title: "GitHub -Profile",
      url: "https://github.com/shubhankarsahu09",
      categoryId: "cat-1780314788048",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780314824411
    },
    {
      id: "bm-imp-1781075300307-972",
      title: "GitHub -New Repo",
      url: "https://github.com/new",
      categoryId: "cat-1780314788048",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780315179557
    },
    {
      id: "bm-imp-1781075300307-714",
      title: "GitHub -Existing Repositories",
      url: "https://github.com/shubhankarsahu09?tab=repositories",
      categoryId: "cat-1780314788048",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780315257025
    },
    {
      id: "bm-imp-1781075300307-679",
      title: "MotionSites",
      url: "https://motionsites.ai/",
      categoryId: "cat-1780321855566",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780321885671
    },
    {
      id: "bm-imp-1781075300307-373",
      title: "Whatsapp",
      url: "https://web.whatsapp.com/",
      categoryId: "cat-1780322087880",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780322104019
    },
    {
      id: "bm-imp-1781075300307-873",
      title: "Instagram",
      url: "https://www.instagram.com/?hl=en",
      categoryId: "cat-1780322087880",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780322132240
    },
    {
      id: "bm-imp-1781075300307-874",
      title: "Discord",
      url: "https://discord.com/channels/@me",
      categoryId: "cat-1780322087880",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780322161046
    },
    {
      id: "bm-imp-1781075300307-524",
      title: "PDF Maker",
      url: "https://app.napkin.ai/page/CgoiCHByb2Qtb25lEiwKBFBhZ2UaJDlkMTQwNjJiLTYzYzAtNGNjMi1hMzA0LTVkZjU1ZjY2OTllOQ",
      categoryId: "cat-1780322315825",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780322332117
    },
    {
      id: "bm-imp-1781075300307-457",
      title: "N8N",
      url: "https://shubhankarsahu.app.n8n.cloud/home/workflows",
      categoryId: "cat-1780322386583",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780322451166
    },
    {
      id: "bm-imp-1781075300307-800",
      title: "Gemini",
      url: "https://gemini.google.com/app?hl=en-IN",
      categoryId: "cat-1780322533475",
      tags: [],
      notes: "",
      starred: true,
      dateAdded: 1780322561360
    },
    {
      id: "bm-imp-1781075300307-940",
      title: "Portfolio",
      url: "https://shubh-portfolio-chi.vercel.app/",
      categoryId: "cat-1780322606889",
      tags: [],
      notes: "",
      starred: true,
      dateAdded: 1780322639434
    },
    {
      id: "bm-imp-1781075300307-591",
      title: "YouTube",
      url: "https://www.youtube.com/",
      categoryId: "cat-1780322087880",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780322746533
    },
    {
      id: "bm-imp-1781075300307-759",
      title: "Amazon",
      url: "https://www.amazon.in/",
      categoryId: "cat-1780322883192",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780322900773
    },
    {
      id: "bm-imp-1781075300307-926",
      title: "Skipper-Ui",
      url: "https://skiper-ui.com/",
      categoryId: "cat-1780321855566",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780323121160
    },
    {
      id: "bm-imp-1781075300307-797",
      title: "Agent",
      url: "https://www.jotform.com/workspace/",
      categoryId: "cat-1780322386583",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780323188415
    },
    {
      id: "bm-imp-1781075300307-400",
      title: "Motion Graphics",
      url: "https://www.swishy.ai/",
      categoryId: "cat-1780321855566",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780323218234
    },
    {
      id: "bm-imp-1781075300307-772",
      title: "keyboard keycap",
      url: "https://meckeys.com/shop/accessories/keyboard-accessories/keycaps/cherry-ink-plum-blossoms-keycap-set/",
      categoryId: "cat-1780322883192",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780323263326
    },
    {
      id: "bm-imp-1781075300307-18",
      title: "payment gateway",
      url: "https://wise.com/",
      categoryId: "cat-1780322994355",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780323406959
    },
    {
      id: "bm-imp-1781075300307-180",
      title: "Supabase",
      url: "https://supabase.com/dashboard/org/cebxwqrxdqebvwxgdqxf",
      categoryId: "cat-1780322994355",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780323490398
    },
    {
      id: "bm-imp-1781075300307-682",
      title: "Gmail",
      url: "https://mail.google.com/mail/u/0/#inbox",
      categoryId: "cat-1780322087880",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780323557520
    },
    {
      id: "bm-imp-1781075300307-982",
      title: "Claude",
      url: "https://claude.ai/new",
      categoryId: "cat-1780322533475",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780323664741
    },
    {
      id: "bm-imp-1781075300307-258",
      title: "Vercel",
      url: "https://vercel.com/shubhankarsahu09s-projects",
      categoryId: "cat-1780322994355",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780452682196
    },
    {
      "id": "bm-imp-1781075300307-954",
      title: "Web Inspirations",
      url: "https://www.awwwards.com/websites/",
      categoryId: "cat-1780321855566",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1780481477631
    },
    {
      id: "bm-1781973997285",
      title: "X",
      url: "https://x.com/Shubhankarsahuu",
      categoryId: "cat-1780322087880",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1781973997285
    },
    {
      id: "bm-1782223851638",
      title: "Sound effects",
      url: "https://www.myinstants.com/en/index/us/",
      categoryId: "cat-1782223837069",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1782223851638
    },
    {
      id: "bm-1782978351772",
      title: "BrandFetch",
      url: "https://brandfetch.com/?__cf_chl_f_tk=5jVgs.mtvqs5rjaOrZTj4TFuQi2cQSNdu.QKKNtoHCo-1782978222-1.0.1.1-TozV0QxTS4pmyP5jAmicoEn3VzXHzPBh15KEJlhED6I",
      categoryId: "cat-1780321855566",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1782978351772
    },
    {
      id: "bm-1784969257103",
      title: "GK Pinterest",
      url: "https://in.pinterest.com/gk722133/?invite_code=f053ca56af154ef2a8bf6650ce234fb8&sender=969118550973443204",
      categoryId: "cat-1782223837069",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1784969257103
    },
    {
      id: "bm-1784969299713",
      title: "KEYBOARD",
      url: "https://www.gravastar.com/products/mercury-k98-pro-mechanical-gaming-keyboard-phantom-black",
      categoryId: "cat-1780322883192",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1784969299713
    },
    {
      id: "bm-1784969517078",
      title: "meta",
      url: "https://business.facebook.com/latest/home?business_id=3013189505553385&asset_id=1226853143847628",
      categoryId: "cat-1784969507221",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1784969517078
    },
    {
      id: "bm-1784969555855",
      title: "wallpaper",
      url: "https://motionbgs.com/",
      categoryId: "cat-1780322087880",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1784969555855
    },
    {
      id: "bm-1784969617151",
      title: "NCERT",
      url: "https://ncert.nic.in/textbook.php",
      categoryId: "cat-1784969596224",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1784969617151
    },
    {
      id: "bm-1784969657595",
      title: "Setuprizx",
      url: "https://creator-three-fawn.vercel.app/",
      categoryId: "cat-1780322606889",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1784969657595
    },
    {
      id: "bm-1784969720777",
      title: "GAMES FREE FILE",
      url: "https://manifesthub.trionine.com/",
      categoryId: "cat-1784969706339",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1784969720777
    },
    {
      id: "bm-1784969747393",
      title: "LOGOS",
      url: "https://www.flaticon.com/",
      categoryId: "cat-1782223837069",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1784969747393
    },
    {
      id: "bm-1784969783725",
      title: "MAIL SENDER",
      url: "https://app.web3forms.com/dashboard",
      categoryId: "cat-1780322994355",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1784969783725
    },
    {
      id: "bm-1784969822161",
      title: "BLENDER TOOL 1",
      url: "https://blender-tool-1.vercel.app/",
      categoryId: "cat-1780322606889",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1784969822161
    },
    {
      id: "bm-1784969864695",
      title: "Anker games",
      url: "https://ankergames.net/",
      categoryId: "cat-1784969706339",
      tags: [],
      notes: "",
      starred: false,
      dateAdded: 1784969864695
    }
  ];

  // State
  let bookmarks = [];
  let categories = [];
  let activeCategory = 'All';
  let searchQuery = '';
  let activeTheme = 'sequoia';
  let activeLayout = 'grid'; // 'grid' or 'cards'
  let isSoundEnabled = true;
  let draggedItemIndex = null;
  let draggedBmId = null;
  let isDraggingCard = false;

  // Helper map for Category resolution
  function getCategoryName(catOrIdOrName) {
    if (!catOrIdOrName) return 'General';
    if (typeof catOrIdOrName === 'object') return catOrIdOrName.name || 'General';
    if (Array.isArray(categories) && categories.length > 0) {
      const found = categories.find(c => c.id === catOrIdOrName || c.name === catOrIdOrName || c === catOrIdOrName);
      if (found) {
        return typeof found === 'object' ? found.name : found;
      }
    }
    const defaultFound = USER_CATEGORIES.find(c => c.id === catOrIdOrName || c.name === catOrIdOrName);
    return defaultFound ? defaultFound.name : catOrIdOrName;
  }

  function getCategoryObj(catOrIdOrName) {
    if (!catOrIdOrName) return null;
    if (typeof catOrIdOrName === 'object') return catOrIdOrName;
    if (Array.isArray(categories) && categories.length > 0) {
      const found = categories.find(c => c.id === catOrIdOrName || c.name === catOrIdOrName);
      if (found) return found;
    }
    return USER_CATEGORIES.find(c => c.id === catOrIdOrName || c.name === catOrIdOrName) || null;
  }

  function getCategoryIcon(catOrIdOrName) {
    const obj = getCategoryObj(catOrIdOrName);
    return (obj && obj.icon) ? obj.icon : '';
  }

  function getCategoryColor(catOrIdOrName) {
    const obj = getCategoryObj(catOrIdOrName);
    return (obj && obj.color) ? obj.color : '';
  }

  // Normalize initial bookmarks with category names and isFavorite flags
  const DEFAULT_BOOKMARKS = USER_BOOKMARKS_RAW.map(b => ({
    ...b,
    category: getCategoryName(b.categoryId),
    isFavorite: Boolean(b.starred || b.isFavorite)
  }));

  const THEMES_CONFIG = {
    sequoia: { name: 'macOS Sequoia', icon: '🌌' },
    sonoma: { name: 'Sonoma Dusk', icon: '🌅' },
    vision: { name: 'visionOS Spatial', icon: '🥽' },
    cupertino: { name: 'Cupertino Frost', icon: '☀️' },
    oled: { name: 'Deep OLED Black', icon: '🌑' }
  };

  // DOM Elements cache (populated on init)
  let htmlRoot;
  let bookmarksGrid;
  let emptyCanvas;
  let categoryPillsContainer;
  let globalSearch;
  let clearSearchBtn;
  let btnToggleLayout;
  let btnSoundToggle;
  let soundIcon;
  let btnThemeMenu;
  let activeThemeIcon;
  let themeMenuDropdown;
  let btnDataHub;
  let btnNewBookmark;
  let btnQuickAddCat;

  // Modal elements (Add / Edit)
  let bookmarkModalOverlay;
  let bookmarkForm;
  let editBookmarkId;
  let modalHeading;
  let modalHeaderEmoji;
  let urlInput;
  let btnPasteUrl;
  let titleInput;
  let categorySelect;
  let modalCategoryPills;
  let notesInput;
  let favCheckbox;
  let modalCloseBtn;
  let modalCancelBtn;
  let modalLiveIconPreview;
  let previewCardTitle;
  let previewCardDomain;
  let previewCardCategory;

  // Backup modal
  let backupModalOverlay;
  let backupCloseBtn;
  let modalFileDropzone;
  let browserHtmlInput;
  let btnExportJsonFile;
  let jsonBackupInput;
  let btnLoadStarterPackAction;
  let emptyAddBtn;
  let emptyLoadStarterBtn;

  // Category Manager modal
  let btnManageCats;
  let categoryModalOverlay;
  let categoryCloseBtn;
  let catManagerInput;
  let btnCatManagerAdd;
  let catManagerList;
  let btnRestoreDefaultCats;

  // Dynamic Toast
  let dynamicToast;

  // Web Audio Context
  let audioCtx = null;

  function playHapticSound(type = 'click') {
    if (!isSoundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(820, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'pop') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Ignore if audio is restricted
    }
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================
  function init() {
    cacheDomElements();
    loadState();
    applyTheme(activeTheme);
    applyLayout(activeLayout);
    updateSoundUI();
    renderCategories();
    renderBookmarks();
    attachListeners();
  }

  function cacheDomElements() {
    htmlRoot = document.documentElement;
    bookmarksGrid = document.getElementById('bookmarksGrid');
    emptyCanvas = document.getElementById('emptyCanvas');
    categoryPillsContainer = document.getElementById('categoryPillsContainer');
    globalSearch = document.getElementById('globalSearch');
    clearSearchBtn = document.getElementById('clearSearchBtn');

    btnToggleLayout = document.getElementById('btnToggleLayout');
    btnSoundToggle = document.getElementById('btnSoundToggle');
    soundIcon = document.getElementById('soundIcon');
    btnThemeMenu = document.getElementById('btnThemeMenu');
    activeThemeIcon = document.getElementById('activeThemeIcon');
    themeMenuDropdown = document.getElementById('themeMenuDropdown');
    btnDataHub = document.getElementById('btnDataHub');
    btnNewBookmark = document.getElementById('btnNewBookmark');
    btnQuickAddCat = document.getElementById('btnQuickAddCat');

    bookmarkModalOverlay = document.getElementById('bookmarkModalOverlay');
    bookmarkForm = document.getElementById('bookmarkForm');
    editBookmarkId = document.getElementById('editBookmarkId');
    modalHeading = document.getElementById('modalHeading');
    modalHeaderEmoji = document.getElementById('modalHeaderEmoji');
    urlInput = document.getElementById('urlInput');
    btnPasteUrl = document.getElementById('btnPasteUrl');
    titleInput = document.getElementById('titleInput');
    categorySelect = document.getElementById('categorySelect');
    modalCategoryPills = document.getElementById('modalCategoryPills');
    notesInput = document.getElementById('notesInput');
    favCheckbox = document.getElementById('favCheckbox');
    modalCloseBtn = document.getElementById('modalCloseBtn');
    modalCancelBtn = document.getElementById('modalCancelBtn');
    modalLiveIconPreview = document.getElementById('modalLiveIconPreview');
    previewCardTitle = document.getElementById('previewCardTitle');
    previewCardDomain = document.getElementById('previewCardDomain');
    previewCardCategory = document.getElementById('previewCardCategory');

    backupModalOverlay = document.getElementById('backupModalOverlay');
    backupCloseBtn = document.getElementById('backupCloseBtn');
    modalFileDropzone = document.getElementById('modalFileDropzone');
    browserHtmlInput = document.getElementById('browserHtmlInput');
    btnExportJsonFile = document.getElementById('btnExportJsonFile');
    jsonBackupInput = document.getElementById('jsonBackupInput');
    btnLoadStarterPackAction = document.getElementById('btnLoadStarterPackAction');
    emptyAddBtn = document.getElementById('emptyAddBtn');
    emptyLoadStarterBtn = document.getElementById('emptyLoadStarterBtn');

    btnManageCats = document.getElementById('btnManageCats');
    categoryModalOverlay = document.getElementById('categoryModalOverlay');
    categoryCloseBtn = document.getElementById('categoryCloseBtn');
    catManagerInput = document.getElementById('catManagerInput');
    btnCatManagerAdd = document.getElementById('btnCatManagerAdd');
    catManagerList = document.getElementById('catManagerList');
    btnRestoreDefaultCats = document.getElementById('btnRestoreDefaultCats');

    dynamicToast = document.getElementById('dynamicToast');
  }

  function loadState() {
    // Purge previous generic website cache so user sees only their provided sites
    ['aeromark_pro_bookmarks_v7', 'aeromark_pro_categories_v7', 
     'aeromark_pro_bookmarks_v6', 'aeromark_pro_categories_v6',
     'aeromark_pro_bookmarks_v5', 'aeromark_pro_categories_v5',
     'aeromark_pro_bookmarks_v4', 'aeromark_pro_categories_v4',
     'aeromark_pro_bookmarks_v3'].forEach(k => {
      try { localStorage.removeItem(k); } catch(e) {}
    });

    // Load categories
    let storedCategories = SafeStorage.getJSON(STORAGE_KEY_CATEGORIES, null);
    if (!storedCategories || !Array.isArray(storedCategories) || storedCategories.length === 0) {
      storedCategories = JSON.parse(JSON.stringify(USER_CATEGORIES));
    }
    categories = storedCategories;

    // Load bookmarks
    let storedBookmarks = SafeStorage.getJSON(STORAGE_KEY_BOOKMARKS, null);
    if (!storedBookmarks || !Array.isArray(storedBookmarks) || storedBookmarks.length === 0) {
      storedBookmarks = JSON.parse(JSON.stringify(DEFAULT_BOOKMARKS));
    } else {
      // Normalize bookmarks ensuring category names & favorite state
      storedBookmarks = storedBookmarks.map(bm => ({
        ...bm,
        category: bm.category || getCategoryName(bm.categoryId),
        isFavorite: Boolean(bm.starred || bm.isFavorite)
      }));
    }
    bookmarks = storedBookmarks;

    saveCategories();
    saveBookmarks();

    activeTheme = SafeStorage.get(STORAGE_KEY_THEME, 'sequoia');
    activeLayout = SafeStorage.get(STORAGE_KEY_LAYOUT, 'grid');
    isSoundEnabled = SafeStorage.get(STORAGE_KEY_SOUND, 'true') !== 'false';
  }

  function saveBookmarks() {
    SafeStorage.set(STORAGE_KEY_BOOKMARKS, bookmarks);
  }

  function saveCategories() {
    SafeStorage.set(STORAGE_KEY_CATEGORIES, categories);
  }

  // ==========================================================================
  // Theme & Layout Management
  // ==========================================================================
  function applyTheme(themeKey) {
    if (!THEMES_CONFIG[themeKey]) themeKey = 'sequoia';
    activeTheme = themeKey;
    htmlRoot.setAttribute('data-theme', themeKey);
    SafeStorage.set(STORAGE_KEY_THEME, themeKey);

    if (activeThemeIcon) {
      activeThemeIcon.textContent = THEMES_CONFIG[themeKey].icon;
    }

    document.querySelectorAll('.theme-menu-item').forEach(item => {
      item.classList.toggle('selected', item.dataset.theme === themeKey);
    });
  }

  function applyLayout(mode) {
    activeLayout = mode;
    htmlRoot.setAttribute('data-layout', mode);
    SafeStorage.set(STORAGE_KEY_LAYOUT, mode);

    if (bookmarksGrid) {
      bookmarksGrid.className = `bookmarks-grid layout-${mode}`;
    }
  }

  function updateSoundUI() {
    htmlRoot.setAttribute('data-sound', isSoundEnabled ? 'true' : 'false');
    if (soundIcon) soundIcon.textContent = isSoundEnabled ? '🔔' : '🔕';
    if (btnSoundToggle) btnSoundToggle.classList.toggle('active', isSoundEnabled);
  }

  // ==========================================================================
  // URL & Favicon Helpers
  // ==========================================================================
  function extractCleanDomain(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || 'site';
    }
  }

  function formatFullUrl(rawUrl) {
    let clean = (rawUrl || '').trim();
    if (!/^https?:\/\//i.test(clean)) {
      clean = 'https://' + clean;
    }
    return clean;
  }

  function getHighResFavicon(url) {
    const domain = extractCleanDomain(url);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

  function showToastNotification(message, icon = '✦') {
    if (!dynamicToast) return;
    dynamicToast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    dynamicToast.classList.add('visible');

    setTimeout(() => {
      dynamicToast.classList.remove('visible');
    }, 2400);
  }

  // ==========================================================================
  // Category Filtering & Shelf
  // ==========================================================================
  function renderCategories() {
    if (!categoryPillsContainer) return;

    const favCount = bookmarks.filter(b => b.isFavorite || b.starred).length;

    let html = `
      <button class="cat-pill ${activeCategory === 'All' ? 'active' : ''}" data-category="All">
        <span>All</span>
        <span class="pill-badge">${bookmarks.length}</span>
      </button>
      <button class="cat-pill ${activeCategory === 'Favorites ⭐️' ? 'active' : ''}" data-category="Favorites ⭐️">
        <span>Favorites ⭐️</span>
        <span class="pill-badge">${favCount}</span>
      </button>
    `;

    categories.forEach(cat => {
      const catName = getCategoryName(cat);
      const catId = typeof cat === 'object' ? cat.id : cat;
      const catIcon = getCategoryIcon(cat);
      const count = bookmarks.filter(b => b.categoryId === catId || b.category === catName).length;
      const isActive = activeCategory === catName || activeCategory === catId;

      html += `
        <button class="cat-pill ${isActive ? 'active' : ''}" data-category="${escapeHtml(catName)}">
          ${catIcon ? `<span class="cat-pill-icon">${catIcon}</span>` : ''}
          <span>${escapeHtml(catName)}</span>
          <span class="pill-badge">${count}</span>
          <span class="cat-delete-quick-btn" data-del-cat="${escapeHtml(catName)}" title="Delete category ${escapeHtml(catName)}">✕</span>
        </button>
      `;
    });

    categoryPillsContainer.innerHTML = html;

    categoryPillsContainer.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const quickDel = e.target.closest('.cat-delete-quick-btn');
        if (quickDel) {
          e.preventDefault();
          e.stopPropagation();
          deleteCategory(quickDel.dataset.delCat);
          return;
        }

        playHapticSound('click');
        activeCategory = btn.dataset.category;
        renderCategories();
        renderBookmarks();
      });
    });
  }

  function deleteCategory(catName) {
    if (!catName || catName === 'All' || catName === 'Favorites ⭐️') return;

    const affectedCount = bookmarks.filter(b => getCategoryName(b.categoryId || b.category) === catName).length;
    const confirmMessage = affectedCount > 0
      ? `Delete category "${catName}"?\n\n${affectedCount} bookmark(s) will be kept safe and moved to "General".`
      : `Delete category "${catName}"?`;

    if (!confirm(confirmMessage)) return;

    // Migrate bookmarks to 'General' so user never loses websites
    if (affectedCount > 0) {
      bookmarks.forEach(b => {
        if (getCategoryName(b.categoryId || b.category) === catName) {
          b.category = 'General';
          b.categoryId = 'cat-general';
        }
      });
      if (!categories.some(c => getCategoryName(c) === 'General')) {
        categories.unshift({
          id: 'cat-general',
          name: 'General',
          icon: '📁',
          color: '#8e8e93'
        });
      }
    }

    // Remove from categories list
    categories = categories.filter(c => getCategoryName(c) !== catName && c !== catName);

    if (activeCategory === catName) {
      activeCategory = 'All';
    }

    saveCategories();
    saveBookmarks();
    playHapticSound('pop');
    renderCategories();
    renderBookmarks();
    renderModalCategoryPills();
    renderCategoryManagerList();
    showToastNotification(affectedCount > 0 
      ? `Deleted "${catName}". Moved ${affectedCount} bookmark(s) to "General".` 
      : `Deleted category "${catName}".`, '🗑️');
  }

  function renameCategory(oldName) {
    if (!oldName || oldName === 'All' || oldName === 'Favorites ⭐️') return;
    const newName = prompt(`Rename category "${oldName}" to:`, oldName);
    if (!newName || !newName.trim() || newName.trim() === oldName) return;

    const clean = newName.trim();
    if (categories.some(c => getCategoryName(c) === clean)) {
      showToastNotification(`Category "${clean}" already exists!`, '⚠️');
      return;
    }

    const targetCat = categories.find(c => getCategoryName(c) === oldName || c === oldName);
    if (targetCat) {
      if (typeof targetCat === 'object') {
        targetCat.name = clean;
      } else {
        const idx = categories.indexOf(oldName);
        if (idx > -1) categories[idx] = clean;
      }
    }

    bookmarks.forEach(b => {
      if (getCategoryName(b.categoryId || b.category) === oldName) {
        b.category = clean;
      }
    });

    if (activeCategory === oldName) {
      activeCategory = clean;
    }

    saveCategories();
    saveBookmarks();
    playHapticSound('success');
    renderCategories();
    renderBookmarks();
    renderModalCategoryPills(clean);
    renderCategoryManagerList();
    showToastNotification(`Renamed to "${clean}"`, '✏️');
  }

  function renderCategoryManagerList() {
    if (!catManagerList) return;

    if (categories.length === 0) {
      catManagerList.innerHTML = `
        <div style="text-align: center; padding: 1.5rem; color: var(--text-dim); font-size: 0.85rem;">
          No categories found. Create one above!
        </div>
      `;
      return;
    }

    catManagerList.innerHTML = categories.map(cat => {
      const catName = getCategoryName(cat);
      const catId = typeof cat === 'object' ? cat.id : cat;
      const catIcon = getCategoryIcon(cat);
      const count = bookmarks.filter(b => b.categoryId === catId || b.category === catName).length;

      return `
        <div class="cat-manager-item">
          <div class="cat-manager-info">
            <span class="cat-manager-name">${catIcon ? catIcon + ' ' : ''}${escapeHtml(catName)}</span>
            <span class="cat-manager-count">${count} site${count === 1 ? '' : 's'}</span>
          </div>
          <div class="cat-manager-actions">
            <button type="button" class="btn-cat-action rename-btn" data-cat="${escapeHtml(catName)}">✎ Rename</button>
            <button type="button" class="btn-cat-action delete-btn" data-cat="${escapeHtml(catName)}">🗑️ Delete</button>
          </div>
        </div>
      `;
    }).join('');

    catManagerList.querySelectorAll('.rename-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playHapticSound('click');
        renameCategory(btn.dataset.cat);
      });
    });

    catManagerList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playHapticSound('click');
        deleteCategory(btn.dataset.cat);
      });
    });
  }

  function openCategoryManagerModal() {
    if (!categoryModalOverlay) return;
    playHapticSound('pop');
    renderCategoryManagerList();
    if (catManagerInput) catManagerInput.value = '';
    categoryModalOverlay.classList.add('open');
    if (catManagerInput) catManagerInput.focus();
  }

  function closeCategoryManagerModal() {
    if (!categoryModalOverlay) return;
    playHapticSound('click');
    categoryModalOverlay.classList.remove('open');
  }

  function restoreDefaultCategories() {
    if (!confirm('Restore your complete set of categories & bookmarks?')) return;

    categories = JSON.parse(JSON.stringify(USER_CATEGORIES));
    bookmarks = JSON.parse(JSON.stringify(DEFAULT_BOOKMARKS));

    saveCategories();
    saveBookmarks();
    playHapticSound('success');
    renderCategories();
    renderBookmarks();
    renderModalCategoryPills();
    renderCategoryManagerList();
    showToastNotification('Restored your original categories & bookmarks!', '✨');
  }

  function createNewCategoryPrompt() {
    const name = prompt('Enter new category name:');
    if (name && name.trim()) {
      const clean = name.trim();
      if (!categories.some(c => getCategoryName(c).toLowerCase() === clean.toLowerCase())) {
        const newCat = {
          id: 'cat-' + Date.now(),
          name: clean,
          icon: '🏷️',
          color: '#0071e3'
        };
        categories.push(newCat);
        saveCategories();
        renderCategories();
        if (categorySelect) categorySelect.value = clean;
        renderModalCategoryPills(clean);
        renderCategoryManagerList();
        playHapticSound('success');
        showToastNotification(`Category "${clean}" created!`, '✨');
      } else {
        showToastNotification('Category already exists!', '⚠️');
      }
    }
  }

  // Quick category pills inside modal
  function renderModalCategoryPills(activeCat = 'General') {
    if (!modalCategoryPills) return;

    modalCategoryPills.innerHTML = categories.map(cat => {
      const catName = getCategoryName(cat);
      const catIcon = getCategoryIcon(cat);
      const isSel = (catName === activeCat);

      return `
        <button type="button" class="modal-cat-pill ${isSel ? 'active' : ''}" data-cat="${escapeHtml(catName)}">
          ${catIcon ? catIcon + ' ' : ''}${escapeHtml(catName)}
        </button>
      `;
    }).join('');

    modalCategoryPills.querySelectorAll('.modal-cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        playHapticSound('click');
        const chosen = pill.dataset.cat;
        if (categorySelect) categorySelect.value = chosen;
        if (previewCardCategory) previewCardCategory.textContent = chosen;
        modalCategoryPills.querySelectorAll('.modal-cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  // ==========================================================================
  // Render Bookmarks
  // ==========================================================================
  function renderBookmarks() {
    if (!bookmarksGrid) return;

    let list = [...bookmarks];

    // Filter Category
    if (activeCategory === 'Favorites ⭐️') {
      list = list.filter(b => b.isFavorite || b.starred);
    } else if (activeCategory !== 'All') {
      list = list.filter(b => {
        const catName = getCategoryName(b.categoryId || b.category);
        return catName === activeCategory || b.category === activeCategory || b.categoryId === activeCategory;
      });
    }

    // Filter Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(b => {
        const catName = getCategoryName(b.categoryId || b.category);
        return (b.title && b.title.toLowerCase().includes(q)) ||
               (b.url && b.url.toLowerCase().includes(q)) ||
               (b.notes && b.notes.toLowerCase().includes(q)) ||
               (catName && catName.toLowerCase().includes(q));
      });
    }

    // Starred / Favorite websites always show up first
    list.sort((a, b) => ((b.isFavorite || b.starred) ? 1 : 0) - ((a.isFavorite || a.starred) ? 1 : 0));

    // Empty State
    if (list.length === 0) {
      bookmarksGrid.innerHTML = '';
      if (emptyCanvas) emptyCanvas.style.display = 'flex';
      return;
    }

    if (emptyCanvas) emptyCanvas.style.display = 'none';

    // Render Tiles
    bookmarksGrid.innerHTML = list.map((bm, index) => {
      const domain = extractCleanDomain(bm.url);
      const iconUrl = getHighResFavicon(bm.url);
      const initial = (bm.title || domain).charAt(0).toUpperCase();
      const catName = getCategoryName(bm.categoryId || bm.category);
      const catIcon = getCategoryIcon(bm.categoryId || bm.category);
      const isFav = Boolean(bm.isFavorite || bm.starred);

      return `
        <div 
          class="bookmark-anchor ${isFav ? 'is-favorite' : ''}" 
          data-id="${bm.id}"
          data-index="${index}"
          data-url="${escapeHtml(bm.url)}"
          draggable="true"
          role="button"
          tabindex="0"
          title="${escapeHtml(bm.title)} — ${escapeHtml(bm.url)}\n(Click to open in new tab)"
        >
          <!-- Quick Action Hover Bar -->
          <div class="hover-actions-bar">
            <button class="action-pill-btn ${isFav ? 'star-active' : ''}" data-action="fav" title="${isFav ? 'Unfavorite' : 'Favorite'}">
              ${isFav ? '★' : '☆'}
            </button>
            <button class="action-pill-btn" data-action="copy" title="Copy Link">
              📋
            </button>
            <button class="action-pill-btn" data-action="edit" title="Edit Bookmark">
              ✎
            </button>
            <button class="action-pill-btn" data-action="delete" title="Delete">
              ✕
            </button>
          </div>

          <!-- Squircle App Icon -->
          <div class="squircle-app-icon">
            <img 
              src="${iconUrl}" 
              alt="${escapeHtml(bm.title)}" 
              loading="lazy" 
              onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <span class="fallback-letter-badge" style="display:none;">${initial}</span>
          </div>

          <span class="bookmark-tile-title">${escapeHtml(bm.title)}</span>
          <span class="bookmark-tile-domain">${domain}</span>
          <span class="bookmark-tile-category-tag" title="Filter by category: ${escapeHtml(catName)}">${catIcon ? catIcon + ' ' : ''}${escapeHtml(catName)}</span>
          ${bm.notes ? `<p class="bookmark-tile-notes">${escapeHtml(bm.notes)}</p>` : ''}
          <span class="launch-tab-badge">↗ New Tab</span>
        </div>
      `;
    }).join('');

    setupInteractiveCards();
  }

  // ==========================================================================
  // Interactive 3D Cursor Tilt, Sheen & Drag-and-Drop Handlers
  // ==========================================================================
  function setupInteractiveCards() {
    const cards = bookmarksGrid.querySelectorAll('.bookmark-anchor');

    cards.forEach(card => {
      const id = card.dataset.id;
      const targetBm = bookmarks.find(b => b.id === id);
      if (!targetBm) return;

      // Click card -> Open in NEW TAB
      card.addEventListener('click', (e) => {
        if (e.target.closest('.hover-actions-bar') || e.target.closest('.bookmark-tile-category-tag') || isDraggingCard) return;
        playHapticSound('click');
        window.open(targetBm.url, '_blank', 'noopener,noreferrer');
      });

      // Click category badge -> quick filter by category
      const catBadge = card.querySelector('.bookmark-tile-category-tag');
      if (catBadge) {
        catBadge.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          playHapticSound('click');
          activeCategory = getCategoryName(targetBm.categoryId || targetBm.category);
          renderCategories();
          renderBookmarks();
        });
      }

      // Keyboard Enter or Space to open
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (!e.target.closest('.hover-actions-bar') && !e.target.closest('.bookmark-tile-category-tag')) {
            e.preventDefault();
            playHapticSound('click');
            window.open(targetBm.url, '_blank', 'noopener,noreferrer');
          }
        }
      });

      // 1. Dynamic 3D Cursor Specular Sheen
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) translateY(-5px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) translateY(0px) rotateX(0deg) rotateY(0deg)';
      });

      // 2. Drag & Drop Reordering
      card.addEventListener('dragstart', (e) => {
        isDraggingCard = true;
        draggedBmId = targetBm.id;
        draggedItemIndex = parseInt(card.dataset.index, 10);
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', targetBm.id);
      });

      card.addEventListener('dragend', () => {
        setTimeout(() => { 
          isDraggingCard = false; 
          draggedBmId = null; 
        }, 50);
        card.classList.remove('dragging');
        cards.forEach(c => c.classList.remove('drag-over'));
      });

      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        card.classList.add('drag-over');
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
      });

      card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.classList.remove('drag-over');

        if (draggedBmId && draggedBmId !== targetBm.id) {
          const srcIdx = bookmarks.findIndex(b => b.id === draggedBmId);
          const destIdx = bookmarks.findIndex(b => b.id === targetBm.id);
          if (srcIdx !== -1 && destIdx !== -1) {
            const [movedItem] = bookmarks.splice(srcIdx, 1);
            bookmarks.splice(destIdx, 0, movedItem);
            saveBookmarks();
            playHapticSound('pop');
            renderBookmarks();
            showToastNotification('Bookmarks reordered!', '✨');
          }
        }
      });

      // 3. Card Action Buttons (fav, copy, edit, delete)
      card.querySelector('[data-action="fav"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const nextState = !Boolean(targetBm.isFavorite || targetBm.starred);
        targetBm.isFavorite = nextState;
        targetBm.starred = nextState;

        // If starred, prioritize it to the top
        if (nextState) {
          const idx = bookmarks.findIndex(b => b.id === targetBm.id);
          if (idx > -1) {
            const [item] = bookmarks.splice(idx, 1);
            bookmarks.unshift(item);
          }
        }

        saveBookmarks();
        playHapticSound('pop');
        renderCategories();
        renderBookmarks();
        showToastNotification(nextState ? `Starred "${targetBm.title}" (Moved to top)` : `Unstarred "${targetBm.title}"`, '⭐️');
      });

      card.querySelector('[data-action="copy"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(targetBm.url).then(() => {
          playHapticSound('click');
          showToastNotification(`Copied link: ${targetBm.url}`, '📋');
        });
      });

      card.querySelector('[data-action="edit"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        playHapticSound('click');
        openEditModal(targetBm);
      });

      card.querySelector('[data-action="delete"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        playHapticSound('click');
        if (confirm(`Delete "${targetBm.title}"?`)) {
          bookmarks = bookmarks.filter(b => b.id !== id);
          saveBookmarks();
          renderCategories();
          renderBookmarks();
          showToastNotification(`Deleted "${targetBm.title}"`, '🗑️');
        }
      });
    });
  }

  // ==========================================================================
  // Live Smart Preview in Add / Edit Modal
  // ==========================================================================
  function updateModalLivePreview() {
    if (!urlInput || !modalLiveIconPreview) return;
    const rawUrl = urlInput.value.trim();
    const formatted = rawUrl ? formatFullUrl(rawUrl) : '';
    const domain = formatted ? extractCleanDomain(formatted) : 'website.com';
    const title = (titleInput && titleInput.value.trim()) || (domain !== 'website.com' ? domain.split('.')[0] : 'Your Website');
    const category = (categorySelect && categorySelect.value) || 'General';

    if (previewCardTitle) previewCardTitle.textContent = title;
    if (previewCardDomain) previewCardDomain.textContent = domain;
    if (previewCardCategory) previewCardCategory.textContent = category;

    if (!rawUrl) {
      modalLiveIconPreview.innerHTML = `<span>✨</span>`;
      if (modalHeaderEmoji) modalHeaderEmoji.textContent = '✨';
      return;
    }

    const iconUrl = getHighResFavicon(formatted);
    modalLiveIconPreview.innerHTML = `
      <img src="${iconUrl}" alt="" onerror="this.onerror=null; this.parentElement.innerHTML='<span>🌐</span>';" />
    `;

    if (titleInput && !titleInput.value.trim() && domain && domain !== 'website.com') {
      const baseName = domain.split('.')[0];
      titleInput.value = baseName.charAt(0).toUpperCase() + baseName.slice(1);
      if (previewCardTitle) previewCardTitle.textContent = titleInput.value;
    }
  }

  function openAddModal() {
    if (!bookmarkModalOverlay) return;
    if (editBookmarkId) editBookmarkId.value = '';
    if (bookmarkForm) bookmarkForm.reset();
    if (modalHeading) modalHeading.textContent = 'Add Bookmark';
    if (modalHeaderEmoji) modalHeaderEmoji.textContent = '✨';

    const defaultCat = (activeCategory !== 'All' && activeCategory !== 'Favorites ⭐️') ? activeCategory : (getCategoryName(categories[0]) || 'General');
    if (categorySelect) categorySelect.value = defaultCat;
    renderModalCategoryPills(defaultCat);
    updateModalLivePreview();

    bookmarkModalOverlay.classList.add('open');
    playHapticSound('click');
    setTimeout(() => { if (urlInput) urlInput.focus(); }, 100);
  }

  function openEditModal(bm) {
    if (!bookmarkModalOverlay) return;
    if (editBookmarkId) editBookmarkId.value = bm.id;
    if (urlInput) urlInput.value = bm.url;
    if (titleInput) titleInput.value = bm.title;
    const cat = getCategoryName(bm.categoryId || bm.category);
    if (categorySelect) categorySelect.value = cat;
    renderModalCategoryPills(cat);
    if (notesInput) notesInput.value = bm.notes || '';
    if (favCheckbox) favCheckbox.checked = Boolean(bm.isFavorite || bm.starred);
    if (modalHeading) modalHeading.textContent = 'Edit Bookmark';
    if (modalHeaderEmoji) modalHeaderEmoji.textContent = '✎';
    updateModalLivePreview();

    bookmarkModalOverlay.classList.add('open');
    setTimeout(() => { if (titleInput) titleInput.focus(); }, 100);
  }

  function closeModal() {
    if (bookmarkModalOverlay) bookmarkModalOverlay.classList.remove('open');
  }

  // ==========================================================================
  // Data Center & Browser HTML Import
  // ==========================================================================
  function openBackupModal() {
    playHapticSound('click');
    if (backupModalOverlay) backupModalOverlay.classList.add('open');
  }
  function closeBackupModal() {
    if (backupModalOverlay) backupModalOverlay.classList.remove('open');
  }

  function handleBrowserHtmlImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const htmlText = event.target.result;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const links = doc.querySelectorAll('a[href]');

        if (links.length === 0) {
          showToastNotification('No bookmarks found in file.', '⚠️');
          return;
        }

        let importedCount = 0;
        const existingUrls = new Set(bookmarks.map(b => b.url.toLowerCase()));

        links.forEach(a => {
          const url = a.getAttribute('href');
          const title = a.textContent.trim() || extractCleanDomain(url);

          if (url && /^https?:\/\//i.test(url) && !existingUrls.has(url.toLowerCase())) {
            let detectedCategory = 'Imported';
            const parentFolder = a.closest('dl')?.previousElementSibling;
            if (parentFolder && parentFolder.tagName === 'H3') {
              detectedCategory = parentFolder.textContent.trim() || 'Imported';
            }

            let catObj = categories.find(c => getCategoryName(c) === detectedCategory);
            if (!catObj) {
              catObj = {
                id: 'cat-' + Date.now() + Math.random().toString(36).slice(2, 5),
                name: detectedCategory,
                icon: '📁',
                color: '#0071e3'
              };
              categories.push(catObj);
            }

            bookmarks.push({
              id: 'bm-imp-' + Date.now() + Math.random().toString(36).slice(2, 6),
              title,
              url,
              categoryId: catObj.id,
              category: detectedCategory,
              tags: [],
              notes: '',
              starred: false,
              isFavorite: false,
              dateAdded: Date.now()
            });
            existingUrls.add(url.toLowerCase());
            importedCount++;
          }
        });

        saveBookmarks();
        saveCategories();
        renderCategories();
        renderBookmarks();
        closeBackupModal();
        playHapticSound('success');
        showToastNotification(`Imported ${importedCount} bookmarks!`, '🎉');
      } catch (err) {
        showToastNotification('Error parsing HTML bookmarks file', '❌');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function exportJsonBackup() {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      categories: categories,
      bookmarks: bookmarks
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aeromark-pro-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playHapticSound('success');
    showToastNotification('Exported JSON backup!', '💾');
  }

  function restoreJsonBackup(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed.bookmarks)) {
          if (Array.isArray(parsed.categories)) {
            categories = parsed.categories;
          }
          bookmarks = parsed.bookmarks.map(bm => ({
            ...bm,
            category: bm.category || getCategoryName(bm.categoryId),
            isFavorite: Boolean(bm.starred || bm.isFavorite),
            starred: Boolean(bm.starred || bm.isFavorite)
          }));
          saveBookmarks();
          saveCategories();
          renderCategories();
          renderBookmarks();
          closeBackupModal();
          playHapticSound('success');
          showToastNotification(`Restored ${bookmarks.length} bookmarks!`, '📦');
        } else {
          showToastNotification('Invalid AeroMark JSON file', '❌');
        }
      } catch {
        showToastNotification('Error reading JSON file', '❌');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function loadStarterPackAction() {
    if (confirm('Restore complete collection of websites?')) {
      categories = JSON.parse(JSON.stringify(USER_CATEGORIES));
      bookmarks = JSON.parse(JSON.stringify(DEFAULT_BOOKMARKS));
      saveCategories();
      saveBookmarks();
      renderCategories();
      renderBookmarks();
      closeBackupModal();
      playHapticSound('success');
      showToastNotification(`Loaded all ${bookmarks.length} bookmarks!`, '⚡️');
    }
  }

  // ==========================================================================
  // Attach Global Listeners
  // ==========================================================================
  function attachListeners() {
    // Form submit
    if (bookmarkForm) {
      bookmarkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawUrl = urlInput ? urlInput.value.trim() : '';
        if (!rawUrl) return;

        const url = formatFullUrl(rawUrl);
        const title = (titleInput && titleInput.value.trim()) || extractCleanDomain(url);
        const category = (categorySelect && categorySelect.value) || 'General';
        const notes = notesInput ? notesInput.value.trim() : '';
        const isFavorite = favCheckbox ? favCheckbox.checked : false;
        const existingId = editBookmarkId ? editBookmarkId.value : '';

        // Find or create category object
        let catObj = categories.find(c => getCategoryName(c) === category);
        if (!catObj) {
          catObj = {
            id: 'cat-' + Date.now(),
            name: category,
            icon: '🏷️',
            color: '#0071e3'
          };
          categories.push(catObj);
          saveCategories();
        }

        if (existingId) {
          const target = bookmarks.find(b => b.id === existingId);
          if (target) {
            target.url = url;
            target.title = title;
            target.categoryId = catObj.id;
            target.category = category;
            target.notes = notes;
            target.isFavorite = isFavorite;
            target.starred = isFavorite;
            showToastNotification(`Updated "${title}"`, '✨');
          }
        } else {
          bookmarks.unshift({
            id: 'bm-' + Date.now(),
            title,
            url,
            categoryId: catObj.id,
            category,
            notes,
            tags: [],
            starred: isFavorite,
            isFavorite,
            dateAdded: Date.now()
          });
          showToastNotification(`Added "${title}"`, '🚀');
        }

        saveBookmarks();
        playHapticSound('success');
        closeModal();
        renderCategories();
        renderBookmarks();
      });
    }

    // Live URL preview on inputs
    if (urlInput) {
      urlInput.addEventListener('input', updateModalLivePreview);
      urlInput.addEventListener('blur', updateModalLivePreview);
    }
    if (titleInput) {
      titleInput.addEventListener('input', updateModalLivePreview);
    }

    // Paste Link Button
    if (btnPasteUrl) {
      btnPasteUrl.addEventListener('click', async () => {
        try {
          playHapticSound('click');
          const text = await navigator.clipboard.readText();
          if (text && text.trim()) {
            if (urlInput) {
              urlInput.value = text.trim();
              updateModalLivePreview();
              playHapticSound('pop');
              showToastNotification('Pasted link from clipboard!', '📋');
            }
          } else {
            showToastNotification('Clipboard is empty', '⚠️');
          }
        } catch {
          if (urlInput) {
            urlInput.focus();
            showToastNotification('Press Ctrl+V to paste link', 'ℹ️');
          }
        }
      });
    }

    // Search Box
    if (globalSearch) {
      globalSearch.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearSearchBtn) clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
        renderBookmarks();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (globalSearch) {
          globalSearch.value = '';
          searchQuery = '';
          clearSearchBtn.style.display = 'none';
          renderBookmarks();
          globalSearch.focus();
        }
      });
    }

    // Layout Switcher
    if (btnToggleLayout) {
      btnToggleLayout.addEventListener('click', () => {
        playHapticSound('click');
        const nextMode = activeLayout === 'grid' ? 'cards' : 'grid';
        applyLayout(nextMode);
        showToastNotification(`Switched to ${nextMode === 'grid' ? 'App Icons' : 'Detailed Cards'} view`, '🔲');
      });
    }

    // Sound Switcher
    if (btnSoundToggle) {
      btnSoundToggle.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        SafeStorage.set(STORAGE_KEY_SOUND, isSoundEnabled ? 'true' : 'false');
        updateSoundUI();
        if (isSoundEnabled) playHapticSound('pop');
        showToastNotification(isSoundEnabled ? 'Sound feedback ON' : 'Sound feedback OFF', isSoundEnabled ? '🔔' : '🔕');
      });
    }

    // Theme Menu Dropdown
    if (btnThemeMenu && themeMenuDropdown) {
      btnThemeMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        playHapticSound('click');
        themeMenuDropdown.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!themeMenuDropdown.contains(e.target) && !btnThemeMenu.contains(e.target)) {
          themeMenuDropdown.classList.remove('open');
        }
      });

      themeMenuDropdown.querySelectorAll('.theme-menu-item').forEach(btn => {
        btn.addEventListener('click', () => {
          playHapticSound('click');
          applyTheme(btn.dataset.theme);
          themeMenuDropdown.classList.remove('open');
          showToastNotification(`Wallpaper: ${btn.querySelector('.theme-title')?.textContent || ''}`, '🎨');
        });
      });
    }

    // Add modal triggers
    if (btnNewBookmark) btnNewBookmark.addEventListener('click', openAddModal);
    if (emptyAddBtn) emptyAddBtn.addEventListener('click', openAddModal);
    if (emptyLoadStarterBtn) emptyLoadStarterBtn.addEventListener('click', loadStarterPackAction);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
    if (btnQuickAddCat) btnQuickAddCat.addEventListener('click', createNewCategoryPrompt);

    // Backup triggers
    if (btnDataHub) btnDataHub.addEventListener('click', openBackupModal);
    if (backupCloseBtn) backupCloseBtn.addEventListener('click', closeBackupModal);
    if (browserHtmlInput) browserHtmlInput.addEventListener('change', handleBrowserHtmlImport);
    if (btnExportJsonFile) btnExportJsonFile.addEventListener('click', exportJsonBackup);
    if (jsonBackupInput) jsonBackupInput.addEventListener('change', restoreJsonBackup);
    if (btnLoadStarterPackAction) btnLoadStarterPackAction.addEventListener('click', loadStarterPackAction);

    // Modal Dropzone Drag & Drop
    if (modalFileDropzone) {
      modalFileDropzone.addEventListener('click', () => {
        if (browserHtmlInput) browserHtmlInput.click();
      });

      modalFileDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        modalFileDropzone.classList.add('drag-active');
      });

      modalFileDropzone.addEventListener('dragleave', () => {
        modalFileDropzone.classList.remove('drag-active');
      });

      modalFileDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        modalFileDropzone.classList.remove('drag-active');
        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        const name = file.name.toLowerCase();
        if (name.endsWith('.html') || name.endsWith('.htm')) {
          handleBrowserHtmlImport({ target: { files: [file], value: '' } });
        } else if (name.endsWith('.json')) {
          restoreJsonBackup({ target: { files: [file], value: '' } });
        } else {
          showToastNotification('Please drop a .html or .json file', '⚠️');
        }
      });
    }

    // Outside modal clicks
    if (bookmarkModalOverlay) {
      bookmarkModalOverlay.addEventListener('click', (e) => {
        if (e.target === bookmarkModalOverlay) closeModal();
      });
    }
    if (backupModalOverlay) {
      backupModalOverlay.addEventListener('click', (e) => {
        if (e.target === backupModalOverlay) closeBackupModal();
      });
    }

    // Category Manager triggers
    if (btnManageCats) btnManageCats.addEventListener('click', openCategoryManagerModal);
    if (categoryCloseBtn) categoryCloseBtn.addEventListener('click', closeCategoryManagerModal);
    if (categoryModalOverlay) {
      categoryModalOverlay.addEventListener('click', (e) => {
        if (e.target === categoryModalOverlay) closeCategoryManagerModal();
      });
    }
    if (btnCatManagerAdd && catManagerInput) {
      const handleAddCatFromModal = () => {
        const val = catManagerInput.value.trim();
        if (val) {
          if (!categories.some(c => getCategoryName(c).toLowerCase() === val.toLowerCase())) {
            const newCat = {
              id: 'cat-' + Date.now(),
              name: val,
              icon: '🏷️',
              color: '#0071e3'
            };
            categories.push(newCat);
            saveCategories();
            renderCategories();
            renderModalCategoryPills();
            renderCategoryManagerList();
            catManagerInput.value = '';
            playHapticSound('success');
            showToastNotification(`Category "${val}" created!`, '✨');
          } else {
            showToastNotification('Category already exists!', '⚠️');
          }
        }
      };
      btnCatManagerAdd.addEventListener('click', handleAddCatFromModal);
      catManagerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddCatFromModal();
        }
      });
    }

    if (btnRestoreDefaultCats) {
      btnRestoreDefaultCats.addEventListener('click', restoreDefaultCategories);
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (globalSearch) {
          globalSearch.focus();
          globalSearch.select();
          playHapticSound('click');
        }
      }

      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        if (globalSearch) {
          globalSearch.focus();
          globalSearch.select();
          playHapticSound('click');
        }
      }

      if ((e.key === 'n' || e.key === 'N') && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        openAddModal();
      }

      if (e.key === 'Escape') {
        closeModal();
        closeBackupModal();
        closeCategoryManagerModal();
        if (themeMenuDropdown) themeMenuDropdown.classList.remove('open');
      }
    });
  }

  // Kickoff
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
