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
      "Clear search",
    
    help_page_title: "Play Detach - Help",
    back_to_apps: "Back to apps",
    help_what_it_does_title: "What it does",
    help_what_it_does_p1: "The Play Store updates apps on its own, even when auto-update is turned off for them. Play Detach hides the apps you choose from the Play Store, so it never offers or installs updates for them.",
    help_what_it_does_p2: "The apps themselves are not changed. They keep working, and you can update them by hand at any time.",
    help_how_to_use_title: "How to use it",
    help_how_to_use_li1: "Find the app in <strong>User apps</strong> or <strong>System apps</strong>. The search box matches app names and package names.",
    help_how_to_use_li2: "Turn on the switch next to it. The change applies right away and the Play Store is restarted, no reboot needed.",
    help_how_to_use_li3: "The <strong>Detached</strong> tab lists every detached app. Turn a switch off to let the Play Store see that app again.",
    help_how_to_use_p: "Apps marked <strong>Not installed</strong> are still on your list but no longer on the phone. Turn them off to remove them from the list.",
    help_backup_title: "Backup and restore",
    help_backup_p1: "Open the <strong>Detached</strong> tab. <strong>Back up list</strong> opens your internal storage: pick a folder, change the file name if you like and tap <strong>Save here</strong>. <strong>Restore backup</strong> opens the same browser: go to the folder and tap the backup file.",
    help_backup_p2: "Restoring replaces the current list with the one in the file. Backups are plain text files with one package per line, so you can also edit them or use them as <code>detach.txt</code>. They stay on your storage when the module is removed.",
    help_status_line_title: "Status line",
    help_status_active: "Active in Play Store",
    help_status_active_desc: "the module is working in the Play Store.",
    help_status_applies: "Applies when the Play Store opens",
    help_status_applies_desc: "the list changed after the Play Store last started; it is saved and loads the next time the Play Store opens.",
    help_status_problem: "Problem",
    help_status_problem_desc: "the module could not start in the Play Store. The message shows the reason; see Troubleshooting below.",
    help_status_orange_note: "Orange right after a change is normal.",
    help_status_orange_desc: "When you turn a switch on or off, the Play Store is closed and the new list is saved. The dot stays orange until the Play Store starts again and loads the new list, then it turns green. Open the Play Store once, or just wait until it starts in the background.",
    help_cmd_line_title: "Command line",
    help_cmd_line_p: "Everything in this page can also be done from a terminal with root. In Termux the short command <code>play-detach</code> is installed as well.",
    cmd_show: "Show detached apps",
    cmd_add: "Detach one or more apps",
    cmd_remove: "Re-attach an app",
    cmd_clear: "Re-attach everything",
    cmd_status: "Check if the current list is active",
    cmd_backup: "Back up the list to Download",
    cmd_restore: "Restore a backup",
    cmd_help: "All commands",
    help_install_time_title: "Detach apps at install time",
    help_install_time_p: "Put a file named <code>detach.txt</code> in the root of the module zip, with one package name per line. The apps in it are detached while the module installs. Lines starting with <code>#</code> are ignored.",
    help_how_it_works_title: "How it works",
    help_how_it_works_p1: "Play Detach is a Zygisk module. It loads only into the Play Store process. When the Play Store asks the system whether a detached app is installed, the module changes that request, so the system answers that the app does not exist.",
    help_how_it_works_p2: "The list is stored in <code>/data/adb/play-detach/detach.list</code>, one package per line. Nothing outside the Play Store is touched.",
    help_requirements_title: "Requirements",
    help_req_1: "arm64 device with Android 10 or newer",
    help_req_2: "A working Zygisk: ReZygisk, Zygisk Next or NeoZygisk on KernelSU, SukiSU-Ultra or APatch, or Zygisk enabled in Magisk",
    help_req_3: "zygisk-detach must not run at the same time, both modules change the same Play Store calls. If it is installed, Play Detach copies its detached apps during install and offers to remove it (Vol+), keep it (Vol-), or disables it if no key is pressed",
    help_troubleshooting_title: "Troubleshooting",
    help_troubleshooting_p1: "If an app still shows up in the Play Store, close the Play Store, clear its cache in system settings and open it again. Then check the module log:",
    help_troubleshooting_p2: "A line with <strong>active in Play Store</strong> means the module works. Any other message names the step that failed, for example a missing Zygisk or a change in a new Android version.",
    help_built_title: "How it is built",
    help_built_zygisk: "Zygisk library",
    help_built_zygisk_desc: "C++20, built with Android NDK r29 for arm64-v8a. Uses Zygisk API v4, so it runs on ReZygisk, Zygisk Next, NeoZygisk and Magisk. No third-party libraries. Every read from Play Store binder data is bounds-checked, and on anything unexpected the call is passed through untouched.",
    help_built_cli: "Command line tool",
    help_built_cli_desc: "a plain shell script. The list is written to a temporary file and then swapped in, so the Play Store never reads a half-written list.",
    help_built_webui: "WebUI",
    help_built_webui_desc: "plain HTML, CSS and JavaScript with no frameworks and no build step. App names and icons come from the root manager's WebUI API. Fonts are bundled, so it works offline.",
    help_built_build: "Build",
    help_built_build_desc: "one <code>build.sh</code> script builds the whole module from source.",
    help_tested_title: "Tested on",
    help_tested_p: "Poco F6 Pro with the Xiaomi.eu ROM (Android 16), SukiSU-Ultra and ReZygisk. Other devices should work but were not tested.",
    footer_text: "Play Detach by Tears Burn. Based on <a href=\"https://github.com/j-hc/zygisk-detach\">zygisk-detach</a> by j-hc. Apache License 2.0."
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
      "Очистить поиск", 
    
    help_page_title: "Play Detach - Справка",
    back_to_apps: "Назад к приложениям",
    help_what_it_does_title: "Что это делает",
    help_what_it_does_p1: "Play Маркет обновляет приложения самостоятельно, даже если для них отключено автообновление. Play Detach скрывает выбранные вами приложения от Play Маркета, поэтому он никогда не предлагает и не устанавливает для них обновления.",
    help_what_it_does_p2: "Сами приложения не изменяются. Они продолжают работать, и вы можете обновлять их вручную в любое время.",
    help_how_to_use_title: "Как пользоваться",
    help_how_to_use_li1: "Найдите приложение в разделе <strong>Пользовательские</strong> или <strong>Системные</strong>. Поиск ищет по названию и имени пакета.",
    help_how_to_use_li2: "Включите переключатель рядом с ним. Изменение применяется сразу, и Play Маркет перезапускается (перезагрузка телефона не требуется).",
    help_how_to_use_li3: "На вкладке <strong>Откреплённые</strong> отображаются все скрытые приложения. Выключите переключатель, чтобы Play Маркет снова увидел приложение.",
    help_how_to_use_p: "Приложения с пометкой <strong>Не установлено</strong> всё ещё находятся в вашем списке, но удалены с телефона. Выключите их, чтобы убрать из списка.",
    help_backup_title: "Резервное копирование и восстановление",
    help_backup_p1: "Откройте вкладку <strong>Откреплённые</strong>. Кнопка <strong>Создать резервную копию</strong> открывает внутреннюю память: выберите папку, при желании измените имя файла и нажмите <strong>Сохранить сюда</strong>. <strong>Восстановить резервную копию</strong> открывает тот же проводник: перейдите к папке и выберите файл бэкапа.",
    help_backup_p2: "Восстановление заменяет текущий список содержимым файла. Бэкапы — это обычные текстовые файлы (по одному пакету на строку), поэтому их можно редактировать или использовать как <code>detach.txt</code>. Они остаются в памяти при удалении модуля.",
    help_status_line_title: "Строка статуса",
    help_status_active: "Работает в Play Маркете",
    help_status_active_desc: "модуль работает в Play Маркете.",
    help_status_applies: "применится после запуска Play Маркета",
    help_status_applies_desc: "список изменился после последнего запуска Play Маркета; он сохранён и загрузится при следующем открытии Play Маркета.",
    help_status_problem: "Проблема",
    help_status_problem_desc: "модуль не смог запуститься в Play Маркете. В сообщении указана причина; см. устранение неполадок ниже.",
    help_status_orange_note: "Оранжевый цвет сразу после изменения — это нормально.",
    help_status_orange_desc: "Когда вы переключаете тумблер, Play Маркет закрывается, а новый список сохраняется. Индикатор горит оранжевым, пока Play Маркет не запустится снова и не загрузит новый список (после этого он станет зелёным). Откройте Play Маркет один раз или просто подождите, пока он запустится в фоне.",
    help_cmd_line_title: "Командная строка",
    help_cmd_line_p: "Всё на этой странице также можно сделать из терминала с root-правами. В Termux также установлена короткая команда <code>play-detach</code>.",
    cmd_show: "Показать откреплённые приложения",
    cmd_add: "Открепить одно или несколько приложений",
    cmd_remove: "Прикрепить приложение обратно",
    cmd_clear: "Прикрепить всё обратно",
    cmd_status: "Проверить, активен ли текущий список",
    cmd_backup: "Сделать бэкап списка в Загрузки",
    cmd_restore: "Восстановить резервную копию",
    cmd_help: "Все команды",
    help_install_time_title: "Открепление приложений при установке",
    help_install_time_p: "Положите файл с именем <code>detach.txt</code> в корень zip-архива модуля, указав по одному имени пакета на строку. Указанные приложения открепятся во время установки модуля. Строки, начинающиеся с <code>#</code>, игнорируются.",
    help_how_it_works_title: "Как это работает",
    help_how_it_works_p1: "Play Detach — это модуль Zygisk. Он загружается только в процесс Play Маркета. Когда Play Маркет спрашивает систему, установлено ли откреплённое приложение, модуль подменяет этот запрос, и система отвечает, что приложение не существует.",
    help_how_it_works_p2: "Список хранится в <code>/data/adb/play-detach/detach.list</code> (по одному пакету на строку). Ничто за пределами Play Маркета не затрагивается.",
    help_requirements_title: "Системные требования",
    help_req_1: "Устройство arm64 с Android 10 или новее",
    help_req_2: "Рабочий Zygisk: ReZygisk, Zygisk Next или NeoZygisk на KernelSU, SukiSU-Ultra или APatch, либо включенный Zygisk в Magisk",
    help_req_3: "zygisk-detach не должен работать одновременно, так как оба модуля изменяют одни и те же вызовы Play Маркета. Если он установлен, Play Detach скопирует его откреплённые приложения при установке и предложит удалить его (Vol+), оставить (Vol-) или отключит автоматически, если клавиша не нажата",
    help_troubleshooting_title: "Устранение неполадок",
    help_troubleshooting_p1: "Если приложение всё ещё отображается в Play Маркете, закройте Play Маркет, очистите его кэш в настройках системы и откройте снова. Затем проверьте лог модуля:",
    help_troubleshooting_p2: "Строка <strong>Работает в Play Маркете</strong> означает, что модуль функционирует. Любое другое сообщение указывает на шаг, который завершился с ошибкой (например, отсутствие Zygisk или изменения в новой версии Android).",
    help_built_title: "Из чего состоит модуль",
    help_built_zygisk: "Библиотека Zygisk",
    help_built_zygisk_desc: "C++20, собрана с Android NDK r29 для arm64-v8a. Использует Zygisk API v4, поэтому работает на ReZygisk, Zygisk Next, NeoZygisk и Magisk. Без сторонних библиотек. Каждое чтение данных связующего слоя (binder) Play Маркета проверяется на границы, и в случае неожиданных данных вызов пропускается без изменений.",
    help_built_cli: "Инструмент командной строки",
    help_built_cli_desc: "простой скрипт оболочки (shell). Список записывается во временный файл, а затем подменяется, поэтому Play Маркет никогда не прочитает наполовину записанный список.",
    help_built_webui: "Веб-интерфейс (WebUI)",
    help_built_webui_desc: "чистый HTML, CSS и JavaScript без фреймворков и этапов сборки. Имена приложений и иконки поступают из WebUI API root-менеджера. Шрифты встроены локально, поэтому всё работает офлайн.",
    help_built_build: "Сборка",
    help_built_build_desc: "один скрипт <code>build.sh</code> собирает весь модуль из исходного кода.",
    help_tested_title: "Проверено на",
    help_tested_p: "Poco F6 Pro с прошивкой Xiaomi.eu (Android 16), SukiSU-Ultra и ReZygisk. На других устройствах тоже должно работать, но они не тестировались.",
    footer_text: "Play Detach от Tears Burn. Основано на <a href=\"https://github.com/j-hc/zygisk-detach\">zygisk-detach</a> от j-hc. Apache License 2.0."
  }
};

export function t(key) {
  return translations[currentLang]?.[key]
    ?? translations.en[key]
    ?? key;
}
