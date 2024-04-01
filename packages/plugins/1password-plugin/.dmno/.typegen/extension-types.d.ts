// TODO: this file will be auto-generated... just showing an example of what we need to output

import { ConfigPath, InjectPluginInputByType } from '@dmno/core';
import { OnePasswordDmnoPlugin } from '../../src/plugin';
import { _PluginInputTypesSymbol } from '@dmno/core';
declare module '../../src/plugin' {
  interface OnePasswordDmnoPlugin {
    [_PluginInputTypesSymbol]: {
      /** token to be used... more jsdoc info... */
      token: string,
    
      defaultVaultId?: string,
      defaultVaultName?: string,
    }
  }

  // example of adding static stuff using a namesapce
  // namespace OnePasswordDmnoPlugin {
  //   let newStatic: number;
  // }
}