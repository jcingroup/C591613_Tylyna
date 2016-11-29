using ClosedXML.Excel;
using DotWeb.Controller;
using LinqKit;
using ProcCore.Business.DB0;
using ProcCore.Business.LogicConect;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DotWeb.Areas.Base.Controllers
{
    public class ExcelReportController : AdminController
    {
        // GET: ExcelReport
        #region 訂單資料維護
        [HttpGet]
        public FileResult Excel_Purchase(Api.PurchaseController.queryParam q)
        {
            var outputStream = stmPurchase(q);
            string setFileName = "訂單資料維護-" + Guid.NewGuid().ToString() + ".xlsx";

            return File(outputStream, "application/vnd.ms-excel", setFileName);
        }
        private MemoryStream stmPurchase(Api.PurchaseController.queryParam q)
        {
            MemoryStream outputStream = new MemoryStream();
            try
            {
                db0 = getDB0();

                XLWorkbook excel = new XLWorkbook();
                IXLWorksheet getSheet = excel.Worksheets.Add("訂單資料維護");

                #region 取得資料
                var items = getPurchaseData(q);
                #endregion


                #region Excel Handle
                makePurchase(items, getSheet);
                //getSheet.Cell(1, 1).Value = "Hello world";
                #endregion

                excel.SaveAs(outputStream);
                outputStream.Position = 0;
                excel.Dispose();
                return outputStream;
            }
            catch (Exception ex)
            {
                //logger.Error(ex);
                return null;
            }
        }
        private List<m_Purchase> getPurchaseData(Api.PurchaseController.queryParam q)
        {
            List<m_Purchase> res = new List<m_Purchase>();
            using (var db0 = getDB0())
            {
                #region getdata
                var predicate = PredicateBuilder.True<Purchase>();
                if (q.keyword != null)
                    predicate = predicate.And(x => x.purchase_no.Contains(q.keyword) ||
                                                   x.receive_name.Contains(q.keyword));

                if (q.order_date != null)
                {
                    DateTime start = (DateTime)q.order_date;
                    DateTime end = ((DateTime)q.order_date).AddDays(1);

                    predicate = predicate.And(x => x.order_date >= start & x.order_date < end);
                }

                if (q.pay_date != null)
                {
                    DateTime start = (DateTime)q.pay_date;
                    DateTime end = ((DateTime)q.pay_date).AddDays(1);

                    predicate = predicate.And(x => x.remit_date >= start & x.remit_date < end);
                }

                if (q.type != null)
                {
                    if (q.type == 1)
                    {//pay_state
                        predicate = predicate.And(x => x.pay_state == q.type_val);
                    }
                    else if (q.type == 2)
                    {//ship_state
                        predicate = predicate.And(x => x.ship_state == q.type_val);
                    }
                }
                res = db0.Purchase.AsExpandable().Where(predicate)
                    .Select(x => new m_Purchase
                    {
                        purchase_no = x.purchase_no,
                        customer_id = x.customer_id,
                        customer_name = x.Customer.c_name,
                        pay_type = x.pay_type,
                        pay_state = x.pay_state,
                        ship_state = x.ship_state,
                        order_date = x.order_date,
                        ship_fee = x.ship_fee,
                        bank_charges = x.bank_charges,
                        total = x.total,
                        receive_name = x.receive_name,
                        receive_tel = x.receive_tel,
                        receive_mobile = x.receive_mobile,
                        receive_zip = x.receive_zip,
                        receive_address = x.receive_address,
                        receive_memo = x.receive_memo,
                        Deatil = x.PurchaseDetail.ToList()
                    }).ToList();
                #endregion
            }
            return res;
        }
        private void makePurchase(List<m_Purchase> data, IXLWorksheet sheet)
        {
            sheet.Cell(1, 1).Value = "銷售明細總表";
            sheet.Range(1, 1, 1, 14).Merge();
            setFontColorAndBg(sheet, 1, 1, XLColor.White, XLColor.Blue);

            int row_index = 2;
            foreach (var i in data)
            {
                #region 主標題
                sheet.Cell(row_index, 1).Value = "[訂單編號]";
                sheet.Cell(row_index, 2).Value = "[購買人]";
                sheet.Cell(row_index, 3).Value = "[付款方式]";
                sheet.Cell(row_index, 4).Value = "[付款狀態]";
                sheet.Cell(row_index, 5).Value = "[出貨狀態]";
                sheet.Cell(row_index, 6).Value = "[下單日期]";
                sheet.Cell(row_index, 7).Value = "[運費]";
                sheet.Cell(row_index, 8).Value = "[手續費]";
                sheet.Cell(row_index, 9).Value = "[總計金額(含運費)]";
                sheet.Cell(row_index, 10).Value = "[收件人]";
                sheet.Cell(row_index, 11).Value = "[收件人電話]";
                sheet.Cell(row_index, 12).Value = "[收件人手機]";
                sheet.Cell(row_index, 13).Value = "[收件人地址]";
                sheet.Cell(row_index, 14).Value = "[收件備註]";

                setFontColor_Label(sheet, row_index, row_index, 1, 14, XLColor.Blue);
                row_index++;
                #endregion

                sheet.Cell(row_index, 1).Value = i.purchase_no;
                sheet.Cell(row_index, 2).Value = i.customer_name;
                sheet.Cell(row_index, 3).Value = CodeSheet.GetStateVal(i.pay_type, i_CodeName.Value, CodeSheet.IPayTypeData);
                sheet.Cell(row_index, 4).Value = CodeSheet.GetStateVal(i.pay_state, i_CodeName.Value, CodeSheet.IPayStateData);
                sheet.Cell(row_index, 5).Value = CodeSheet.GetStateVal(i.ship_state, i_CodeName.Value, CodeSheet.IShipStateData);
                sheet.Cell(row_index, 6).Value = i.order_date.ToString("yyyy/MM/dd HH:mm");
                sheet.Cell(row_index, 7).Value = i.ship_fee;
                sheet.Cell(row_index, 8).Value = i.bank_charges;
                sheet.Cell(row_index, 9).Value = i.total;
                sheet.Cell(row_index, 10).Value = i.receive_name;
                sheet.Cell(row_index, 11).Value = i.receive_tel;
                sheet.Cell(row_index, 12).Value = i.receive_mobile;
                sheet.Cell(row_index, 13).Value = i.receive_zip + "-" + i.receive_address;
                sheet.Cell(row_index, 14).Value = i.receive_memo;

                row_index++;

                #region 次標題
                sheet.Cell(row_index, 3).Value = "產品購買清單";
                sheet.Range(row_index, 3, row_index, 9).Merge();
                setFontColorAndBg(sheet, row_index, 3, XLColor.White, XLColor.DeepSkyBlue);
                row_index++;

                sheet.Cell(row_index, 3).Value = "[項次]";
                sheet.Cell(row_index, 4).Value = "[產品料號]";
                sheet.Cell(row_index, 5).Value = "[產品名稱]";
                sheet.Cell(row_index, 6).Value = "[產品包裝]";
                sheet.Cell(row_index, 7).Value = "[單價]";
                sheet.Cell(row_index, 8).Value = "[數量]";
                sheet.Cell(row_index, 9).Value = "[小計]";
                setFontColor_Label(sheet, row_index, row_index, 3, 9, XLColor.Blue);
                row_index++;
                #endregion
                int index = 1;
                foreach (var detail in i.Deatil)
                {
                    sheet.Cell(row_index, 3).Value = index;
                    sheet.Cell(row_index, 4).Value = detail.p_d_sn;
                    sheet.Cell(row_index, 5).Value = detail.p_name;
                    sheet.Cell(row_index, 6).Value = CodeSheet.GetStateVal((int)detail.p_d_pack_type, i_CodeName.Value, CodeSheet.pack_type);
                    sheet.Cell(row_index, 7).Value = detail.price;
                    sheet.Cell(row_index, 8).Value = detail.qty;
                    sheet.Cell(row_index, 9).Value = detail.sub_total;

                    row_index++;
                }

                row_index++;
            }

            sheet.ColumnsUsed().AdjustToContents();//自動調整寬度
        }
        #endregion

        #region style
        public void setFontColorAndBg(IXLWorksheet sheet, int row, int column, XLColor font, XLColor bg)
        {
            sheet.Cell(row, column).Style.Font.Bold = true;//文字-粗體
            sheet.Cell(row, column).Style.Font.FontColor = font;//文字-顏色
            sheet.Cell(row, column).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            sheet.Cell(row, column).Style.Fill.BackgroundColor = bg;//背景顏色
            sheet.Cell(row, column).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;//文字置中
        }
        public void setFontColor_Label(IXLWorksheet sheet, int s_row, int e_row, int s_column, int e_column, XLColor font)
        {
            sheet.Range(s_row, s_column, e_row, e_column).Style.Font.Bold = true;//文字-粗體
            sheet.Range(s_row, s_column, e_row, e_column).Style.Font.FontColor = font;//文字-顏色
            sheet.Range(s_row, s_column, e_row, e_column).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;//文字置中
        }
        #endregion
        #region param、model
        public class m_Purchase
        {
            public string purchase_no { get; set; }
            public int customer_id { get; set; }
            public System.DateTime order_date { get; set; }
            public int pay_type { get; set; }
            public int pay_state { get; set; }
            public int ship_state { get; set; }
            public Nullable<System.DateTime> ship_date { get; set; }
            public string cancel_reason { get; set; }
            public double total { get; set; }
            public double ship_fee { get; set; }
            public double bank_charges { get; set; }
            public string receive_email { get; set; }
            public string receive_name { get; set; }
            public string receive_tel { get; set; }
            public string receive_mobile { get; set; }
            public string receive_zip { get; set; }
            public string receive_address { get; set; }
            public string receive_memo { get; set; }
            public string remit_no { get; set; }
            public Nullable<System.DateTime> remit_date { get; set; }
            public Nullable<double> remit_money { get; set; }
            public string remit_memo { get; set; }

            public IEnumerable<PurchaseDetail> Deatil { get; set; }
            public string customer_name { get; set; }
        };
        #endregion
    }
}