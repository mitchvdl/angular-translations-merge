### Merging Translations

#### Purpose
This script is used to streamline the i18n translation workflow in our project. It helps developers manage localization updates by merging a newly extracted translation file (`messages.xlf`) into an existing localized file (e.g., `messages.fr.xlf`). This ensures the localized files are kept up-to-date with new keys, while preserving existing translations. It will clone the keys that do not exist as `target` yet.

---

#### Usage
Run the script from the root directory of the project using the following command:
```bash
node merge_translations.js <input.xlf> <locale.xlf>
```

#### Arguments
- `<input.xlf>`: The file containing the latest extracted keys (e.g., `messages.xlf`). Extractd using `ng extract-i18n`
- `<locale.xlf>`: The localized file to update (e.g., `messages.fr.xlf`).

#### Example
```bash
node tools/merge_translations.js src/assets/i18n/messages.xlf src/assets/i18n/messages.fr.xlf
```
This will update the `messages.fr.xlf` file by:
1. Adding new keys from `messages.xlf`.
2. Retaining existing translations from `messages.fr.xlf`.
3. Setting the `<target>` of untranslated keys to their `<source>` value.

---

#### Steps
1. Extract the latest translations from the Angular project:
   ```bash
   ng extract-i18n --output-path src/assets/i18n/
   ```
2. Run the script to merge the new keys into the localized file.
3. Review the updated localized file and complete any new translations as needed. Gitdiff is helpfull.

---

#### Notes
- The script ensures the output XML is properly formatted for readability.
- If a key exists in the input file but not in the localized file, its `<target>` will default to the `<source>` value for easier translation.
- Make sure both input and localized files follow the XLF format.

---

#### Troubleshooting
- **File Not Found**: Ensure the paths to both the input and localized files are correct.
- **Invalid XML**: Check that both files conform to the standard XLF schema used by Angular.

---


