module.exports = {
  vueFilesPath: "./src/components/**/*.?(js|vue)", // The Vue.js file(s) you want to extract i18n strings from. It can be a path to a folder or to a file. It accepts glob patterns. (ex. *, ?, (pattern|pattern|pattern)
  languageFilesPath: "./src/locales/**/*.?(json|yaml|yml)", //The language file(s) you want to compare your Vue.js file(s) to. It can be a path to a folder or to a file. It accepts glob patterns (ex. *, ?, (pattern|pattern|pattern)
  options: {
    separator: ".",
    output: false, // false | string => Use if you want to create a json file out of your report. (ex. output.json)
    add: true, // false | true => Use if you want to add missing keys into your json language files.
    dynamic: false, // false | 'ignore' | 'report' => 'ignore' if you want to ignore dynamic keys false-positive. 'report' to get dynamic keys report.
  },
};
