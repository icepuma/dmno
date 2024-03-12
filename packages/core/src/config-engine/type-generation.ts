import _ from 'lodash-es';
import {
  DmnoConfigItem, DmnoConfigItemBase, DmnoPickedConfigItem, DmnoService,
} from './config-engine';
import { DmnoBaseTypes, DmnoDataType } from './base-types';

export function generateTypescriptTypes(service: DmnoService) {
  let tsSrc = [
    '// THIS IS AN AUTOGENERATED FILE - DO NOT EDIT DIRECTLY',
    '',
    'type DmnoGeneratedConfigSchema = {',
  ];
  //   /** a random number! */
  //   readonly VITE_RANDOM_NUM?: number;
  // }

  for (const itemKey in service.config) {
    const configItem = service.config[itemKey];

    tsSrc.push(...getTsDefinitionForItem(configItem, 1));
  }


  tsSrc.push(...[
    '}',
    '',
    '',
    '/** global obj to access your DMNO powered config */',
    'declare var DMNO_CONFIG: DmnoGeneratedConfigSchema',
  ]);


  console.log(tsSrc.join('\n'));
  return tsSrc.join('\n');
}


function getTsDefinitionForItem(item: DmnoConfigItemBase, indentLevel = 0) {
  const i = _.times(indentLevel, () => '  ').join('');
  const itemSrc = [];

  // TODO - we are assuming here that the config has been fully resolved
  // meaning if we had settings varying based on values (ex: something is required only for prod) then this wouldn't work
  // so we'll need to add a concept of fully resolving the config and triggering that first
  // also begs the question of what the types look like when the schema can vary like that...

  // TODO: also will need to figure out how we deal with null values
  // since we might need something like `key: string | null` rather than `key?: string`

  const jsDocLines = [];
  const itemType = item.type;
  if (itemType.getDefItem('description')) jsDocLines.push(itemType.getDefItem('description'));
  if (itemType.getDefItem('typeDescription')) jsDocLines.push(itemType.getDefItem('typeDescription'));

  if (jsDocLines.length === 1) {
    itemSrc.push(`/** ${jsDocLines[0]} */`);
  } else if (jsDocLines.length > 1) {
    itemSrc.push(...[
      '/**',
      ..._.map(jsDocLines, (line) => ` * ${line}`),
      ' */',
    ]);
  }

  // TODO: logic should probably be within the Item class(es) and we still need to figure out how to identify these types...
  const baseType = itemType.primitiveBaseType;
  let itemTsType = 'string';
  if (baseType === DmnoBaseTypes.string) {
    itemTsType = 'string';
  } else if (baseType === DmnoBaseTypes.number) {
    itemTsType = 'number';
  } else if (baseType === DmnoBaseTypes.boolean) {
    itemTsType = 'boolean';
  } else if (baseType === DmnoBaseTypes.enum) {
    itemTsType = "'a' | 'b' | 'c'";
  } else if (baseType === DmnoBaseTypes.object) {
    itemTsType = '{}';
  }


  itemSrc.push(`readonly ${item.key}${itemType.getDefItem('required') ? '' : '?'}: ${itemTsType};`);
  itemSrc.push('');
  return _.map(itemSrc, (line) => `${i}${line}`);
}

