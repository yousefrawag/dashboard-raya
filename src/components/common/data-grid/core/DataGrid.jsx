/* eslint-disable no-unused-vars */

import { DataGridInner, DataGridProvider } from '.';
const DataGrid = props => {
  console.log("prpos sendded to tabel" , props);
  
  return <DataGridProvider {...props}>
      <DataGridInner />
    </DataGridProvider>;
};
export { DataGrid };