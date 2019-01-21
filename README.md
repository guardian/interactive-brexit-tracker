# Interactive division script

### Using this script 

This script requires a configuration json file with 2 params:
- "hasAmendments" (boolean): used to determine wether to display the amendments section and other style elements in the table
- "googleSheetUrl" (url address): url to the google sheet with the division ids required

Note that this is a separate file to the standard config.json file that comes with the interactive atom template

When you run the script you will be prompted to enter the name of the correct configuration file (without the .json extension)

```
npm run parse

Enter script config name:
[Name of your file]
Fetching division(s) info...

```



