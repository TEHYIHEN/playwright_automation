import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import * as XLSX from 'xlsx';

dotenv.config();


const url:any = process.env.company_url;
const username:any = process.env.my_username;
const password:any = process.env.my_password;

const workbook = XLSX.readFile('C:/Users/tehyi/OneDrive/Desktop/My excel secret/InboundJukiPath/Information/Details.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet) as { 
  
  InvoiceNumber: string,
  CargoFrom: string,
  Remark: string,
  ShippingMethod: string

}[];

const row = data[0];



test('test', async ({ page }) => {

  test.setTimeout(180000);

  await page.goto(url);
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill(username);
  await page.locator('#password-input').click();
  await page.locator('#password-input').fill(password);
  await page.getByRole('button', { name: 'LOGIN' }).click();
  await page.locator('div').filter({ hasText: /^PRODUCTS$/ }).click();
  await page.getByText('PRODUCT LIST').click();
  await page.getByRole('button', { name: 'IMPORT NEW ITEM' }).click();
  // await page.getByRole('button', { name: 'SELECT FILE' }).click();

  // await page.getByRole('button', { name: 'SELECT FILE' }).setInputFiles("C:/Users/tehyi/OneDrive/Desktop/My excel secret/InboundJukiPath/Information/UploadProduct.xlsx");
  await page.locator('input[type="file"]').setInputFiles("C:/Users/tehyi/OneDrive/Desktop/My excel secret/InboundJukiPath/Information/UploadProduct.xlsx");
  await page.getByRole('button', { name: 'UPLOAD' }).click();
  await page.getByRole('button', { name: 'Close this dialog' }).click();
  await page.locator('div').filter({ hasText: /^ORDER$/ }).click();


  //await page.getByText('INWARD LIST').first().click();
  const inwardList = page.getByText('INWARD LIST').first();
  await inwardList.waitFor({ state: 'visible' });
  await inwardList.click();

  //await page.getByRole('button', { name: 'CREATE' }).click();
  const createBtn = page.getByRole('button', { name: 'CREATE' });
  await createBtn.waitFor({ state: 'visible' }); 
  await createBtn.click();

  await page.locator('div').filter({ hasText: /^CUS REF.$/ }).locator('input, [role="textbox"]').fill(String(row.InvoiceNumber));
  await page.locator('div').filter({ hasText: /^CARGO FROM$/ }).locator('input, [role="textbox"]').fill(String(row.CargoFrom));

  await page.locator('div').filter({ hasText: /^SELECTED$/ }).nth(2).click();
  await page.getByRole('option', { name: row.ShippingMethod }).click();
  await page.locator('div:nth-child(8) > .el-col > .description_cell > .description_label').click();
 
  await page.locator('.description_cell')
    .filter({ has: page.locator('.description_label', { hasText: /REMARKS/i }) })
    .locator('.description_content input, .description_content textarea')
    .fill(String(row.Remark || ""));

  await page.getByRole('button', { name: 'SAVE' }).click();
  await page.getByRole('tab', { name: 'ITEM' }).click();

  await page.getByRole('button', { name: 'UPLOAD', exact: true }).click();
  
  await page.getByRole('dialog', { name: 'UPLOAD' })
  .locator('input[type="file"]')
  .setInputFiles("C:/Users/tehyi/OneDrive/Desktop/My excel secret/InboundJukiPath/Information/InwardList.xlsx");
  await page.getByRole('dialog').getByRole('button', { name: 'UPLOAD' }).click();

  await page.getByRole('button', { name: 'Close this dialog' }).click();
  await page.getByRole('button', { name: 'CONFIRM' }).click();
  
  await page.locator('.el-loading-mask').waitFor({ state: 'hidden' }); 

  let isEnabled = false;
  for (let i = 0; i < 5; i++) { // 最多尝试刷新 5 次
    await page.reload({ waitUntil: 'networkidle' });
    const btnStatus = await page.getByRole('button', { name: 'WAREHOUSE' }).isEnabled();
    if (btnStatus) {
      isEnabled = true;
      break; 
    }
    await page.waitForTimeout(2000); // 每次刷新间歇 2 秒
  }

  if (!isEnabled) throw new Error("刷新了5次，WAREHOUSE 按钮还是不可点！");
  await page.getByRole('button', { name: 'WAREHOUSE' }).click();
  
  const warehouseDialog = page.getByRole('tabpanel', { name: /WAREHOUSE:/ });
// 通常弹窗里只有一个主要的输入框，直接找 input 或 textarea 即可
  await warehouseDialog.locator('.description_cell')
    .filter({ has: page.locator('.description_label', { hasText: /REMARKS/i }) })
    .locator('.description_content input, .description_content textarea')
    .fill(String(row.Remark || ""));
  await page.getByRole('button', { name: 'SAVE' }).click();
  await page.getByRole('button', { name: 'CREATE WARRANT' }).click();

});