// Play Detach localization

let currentLang = "en";

export async function detectLanguage(exec) {
  try {
    const res = await exec(`
      lang=$(cmd activity get-config 2>/dev/null \
        | grep -oE '[a-z]{2}-r[A-Z]{2}' \
        | head -n1 \
        | cut -d- -f1)

      [ -z "$lang" ] && lang=$(getprop persist.sys.locale | cut -c1-2)
      [ -z "$lang" ] && lang=$(getprop ro.product.locale | cut -c1-2)

      echo "$lang"
    `);

    const lang = res.stdout.trim().toLowerCase();

    if (lang === "ru") {
      currentLang = "ru";
      document.documentElement.lang = "ru";
      return "ru";
    }
  } catch {}

  const fallback =
    (navigator.language || "en")
      .toLowerCase()
      .startsWith("ru")
      ? "ru"
      : "en";

  currentLang = fallback;
  document.documentElement.lang = fallback;

  return fallback;
}

export function getLanguage() {
  return currentLang;
}

const translations = {
  en: {
    help: "Help",

    loading: "Loading...",

    search_placeholder: "Search apps or packages",

    user_apps: "User apps",
    system_apps: "System apps",
    detached: "Detached",

    not_installed: "Not installed",

    no_matches: "No matches",
    try_other_package: "Try another name or package.",

    no_detached_apps: "No detached apps yet",
    no_detached_apps_desc:
      "Turn on the switch next to an app to stop Play Store updates for it.",

    no_apps_here: "No apps here",

    backup_list: "Back up list",
    restore_backup: "Restore backup",
    reattach_all: "Re-attach all",

    save_backup: "Save backup",
    choose_backup: "Choose a backup",

    file_name: "File name",

    save_here: "Save here",
    cancel: "Cancel",
    restore: "Restore",

    file_exists:
      "A file with this name is already here and will be replaced.",

    internal_storage: "Internal storage",
    up_one_folder: "Up one folder",

    no_folders: "No folders here.",
    no_backup_files: "No folders or .txt files here.",

    open_root_manager:
      "Open this page from your root manager",

    could_not_change_list:
      "Could not change the list",

    could_not_clear_list:
      "Could not clear the list",

    could_not_open_folder:
      "Could not open this folder",

    could_not_save_backup:
      "Could not save the backup",

    could_not_restore_backup:
      "Could not restore the backup",

    all_apps_reattached:
      "All apps re-attached",

    status_idle:
      "No apps detached yet",

    active_in_play_store:
      "Active in Play Store",

    problem:
      "Problem",

    applies_when_open:
      "applies when the Play Store opens",

    restore_backup_title:
      "Restore this backup?",

    restore_backup_text:
      "Your current list is replaced with the apps saved in",

    confirm_reattach_title:
      "Re-attach all apps?",

    confirm_reattach_text:
      "The Play Store will see every detached app again and offer updates for them.",

    copied:
      "Command copied",

    copy_not_supported:
      "Copy is not supported here",

    copy_command:
      "Copy command",

    detached_suffix:
      "detached",

    reattached_suffix:
      "re-attached",

    app:
      "app",

    apps:
      "apps",

    zygisk_module:
      "Zygisk module",

    help_title:
      "Help",  
 
    clear_search:
      "Clear search"  
  },

  ru: {
    help: "Справка",

    loading: "Загрузка...",

    search_placeholder: "Поиск приложений или пакетов",

    user_apps: "Пользовательские",
    system_apps: "Системные",
    detached: "Откреплённые",

    not_installed: "Не установлено",

    no_matches: "Ничего не найдено",
    try_other_package:
      "Попробуйте другое название или пакет.",

    no_detached_apps:
      "Нет откреплённых приложений",

    no_detached_apps_desc:
      "Включите переключатель рядом с приложением, чтобы Play Маркет не предлагал обновления.",

    no_apps_here:
      "Здесь нет приложений",

    backup_list:
      "Создать резервную копию",

    restore_backup:
      "Восстановить резервную копию",

    reattach_all:
      "Прикрепить всё",

    save_backup:
      "Сохранить резервную копию",

    choose_backup:
      "Выберите резервную копию",

    file_name:
      "Имя файла",

    save_here:
      "Сохранить сюда",

    cancel:
      "Отмена",

    restore:
      "Восстановить",

    file_exists:
      "Файл с таким именем уже существует и будет заменён.",

    internal_storage:
      "Внутренняя память",

    up_one_folder:
      "На уровень выше",

    no_folders:
      "Здесь нет папок.",

    no_backup_files:
      "Здесь нет папок или файлов .txt.",

    open_root_manager:
      "Откройте страницу через root-менеджер",

    could_not_change_list:
      "Не удалось изменить список",

    could_not_clear_list:
      "Не удалось очистить список",

    could_not_open_folder:
      "Не удалось открыть папку",

    could_not_save_backup:
      "Не удалось сохранить резервную копию",

    could_not_restore_backup:
      "Не удалось восстановить резервную копию",

    all_apps_reattached:
      "Все приложения снова прикреплены",

    status_idle:
      "Нет откреплённых приложений",

    active_in_play_store:
      "Работает в Play Маркете",

    problem:
      "Проблема",

    applies_when_open:
      "применится после запуска Play Маркета",

    restore_backup_title:
      "Восстановить эту резервную копию?",

    restore_backup_text:
      "Текущий список будет заменён приложениями из",

    confirm_reattach_title:
      "Прикрепить все приложения?",

    confirm_reattach_text:
      "Play Маркет снова увидит все откреплённые приложения и сможет предлагать их обновление.",

    copied:
      "Команда скопирована",

    copy_not_supported:
      "Копирование здесь не поддерживается",

    copy_command:
      "Копировать команду",

    detached_suffix:
      "откреплено",

    reattached_suffix:
      "прикреплено",

    app:
      "приложение",

    apps:
      "",

    zygisk_module:
      "Модуль Zygisk",
    
    help_title:
      "Справка", 
 
    clear_search: 
      "Очистить поиск"
  }
};

export function t(key) {
  return translations[currentLang]?.[key]
    ?? translations.en[key]
    ?? key;
}
