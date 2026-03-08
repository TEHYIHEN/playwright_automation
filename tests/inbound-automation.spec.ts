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
  await page.goto(url);
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill(username);
  await page.locator('#password-input').click();
  await page.locator('#password-input').fill(password);
  await page.getByRole('button', { name: 'LOGIN' }).click();
  await page.locator('div').filter({ hasText: /^PRODUCTS$/ }).click();
  await page.getByText('PRODUCT LIST').click();
  await page.getByRole('button', { name: 'IMPORT NEW ITEM' }).click();
  await page.getByRole('button', { name: 'SELECT FILE' }).click();

  await page.getByRole('button', { name: 'SELECT FILE' }).setInputFiles("C:/Users/tehyi/OneDrive/Desktop/My excel secret/InboundJukiPath/Information/UploadProduct.xlsx");
  await page.getByRole('button', { name: 'UPLOAD' }).click();
  await page.getByRole('button', { name: 'Close this dialog' }).click();
  await page.locator('div').filter({ hasText: /^ORDER$/ }).click();
  await page.getByText('INWARD LIST').first().click();
  await page.getByRole('button', { name: 'CREATE' }).click();
  await page.getByText('CUS REF.').click();
  await page.locator('#el-id-5637-226').click();
  await page.locator('#el-id-5637-226').fill(row.InvoiceNumber);
  await page.locator('#el-id-5637-228').click();
  await page.locator('#el-id-5637-228').click();
  await page.locator('#el-id-5637-228').fill(row.CargoFrom);
  await page.locator('div').filter({ hasText: /^SELECTED$/ }).nth(2).click();
  await page.getByRole('option', { name: row.ShippingMethod }).click();
  await page.locator('#el-id-5637-233').click();
  await page.locator('#el-id-5637-233').fill(row.Remark);
  await page.getByRole('button', { name: 'SAVE' }).click();
  await page.getByRole('tab', { name: 'ITEM' }).click();
  await page.getByRole('button', { name: 'UPLOAD', exact: true }).click();
  await page.getByRole('button', { name: 'SELECT FILE' }).setInputFiles("C:/Users/tehyi/OneDrive/Desktop/My excel secret/InboundJukiPath/Information/InwardList.xlsx");
  await page.getByRole('dialog').getByRole('button', { name: 'UPLOAD' }).click();

  await page.getByRole('button', { name: 'Close this dialog' }).click();
  await page.getByRole('button', { name: 'CONFIRM' }).click();
  // await page.locator('#tab-20260308210708RRKVPM1CG8NJXH0GBB83FBEGHWLPRX > .el-icon > svg').click();
  // await page.locator('#tab-202603082106369I666SKRCL05AJH6MJJX32CMXBHXRQ > .el-icon > svg').click();
  // await page.getByText('INWARD LIST').first().click();
  // await page.locator('a').filter({ hasText: 'SPIJ26030016' }).click();
  await page.locator('.el-loading-mask').waitFor({ state: 'hidden' }); 
  await page.reload();
  await page.getByRole('button', { name: 'WAREHOUSE' }).click();
  await page.locator('#el-id-5637-607').click();
  await page.locator('#el-id-5637-607').fill('JUKI CORP VIA AIR(38 CTNS)');
  await page.getByRole('button', { name: 'SAVE' }).click();
});