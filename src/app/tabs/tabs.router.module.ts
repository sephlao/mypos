import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'pos',
    component: TabsPage,
    children: [
      {
        path: 'calc',
        children: [
          {
            path: '',
            loadChildren: '../calc/calc.module#CalcPageModule'
          }
        ]
      },
      {
        path: 'sales',
        children: [
          {
            path: '',
            loadChildren: '../sales/sales.module#SalesPageModule'
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: '../tab3/tab3.module#Tab3PageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/pos/calc',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/pos/calc',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
