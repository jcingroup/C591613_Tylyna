using DotWeb.Controller;
using OfficeOpenXml;
using OfficeOpenXml.Style;
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

        //[HttpGet]
        //public FileResult BuildDesign(Api.PurchaseController.queryParam q)
        //{
        //    var outputStream = stmBuildDesign(CustId, YY);
        //    string setFileName = "七、建築資料-" + Guid.NewGuid().ToString() + ".xlsx";

        //    return File(outputStream, "application/vnd.ms-excel", setFileName);
        //}


        public void setCellBackgroundColor_MonthHead(ExcelWorksheet sheet, int row, int column)
        {
            sheet.Cells[row, column].Style.Font.Size = 14;//文字大小設定14
            sheet.Cells[row, column].Style.Font.Name = "微軟正黑體";
            sheet.Cells[row, column].Style.Fill.PatternType = ExcelFillStyle.Solid;
            sheet.Cells[row, column].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.DeepSkyBlue);
        }
        public void setCellBackgroundColor_Label(ExcelWorksheet sheet, int row, int start_column, int end_column)
        {
            for (; start_column <= end_column; start_column++)
            {
                sheet.Cells[row, start_column].Style.Fill.PatternType = ExcelFillStyle.Solid;
                sheet.Cells[row, start_column].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightSkyBlue);
            }
        }
        public void setFontColor_Label(ExcelWorksheet sheet, int row, int start_column, int end_column)
        {
            for (; start_column <= end_column; start_column++)
            {
                sheet.Cells[row, start_column].Style.Font.Bold = true;
                sheet.Cells[row, start_column].Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                sheet.Cells[row, start_column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            }
        }
        public void setFontColor_LabelBord(ExcelWorksheet sheet, int row, int start_column, int end_column)
        {
            for (; start_column <= end_column; start_column++)
            {
                sheet.Cells[row, start_column].Style.Font.Bold = true;
                sheet.Cells[row, start_column].Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                sheet.Cells[row, start_column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                sheet.Cells[row, start_column].Style.Border.BorderAround(OfficeOpenXml.Style.ExcelBorderStyle.Thin);//儲存格框線
            }
        }
        public void setFontColor_blue(ExcelWorksheet sheet, int row, int column)
        {
            sheet.Cells[row, column].Style.Font.Bold = true;
            sheet.Cells[row, column].Style.Font.Color.SetColor(System.Drawing.Color.Blue);
            sheet.Cells[row, column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        }
        public void setFontColor_red(ExcelWorksheet sheet, int row, int column)
        {
            sheet.Cells[row, column].Style.Font.Bold = true;
            sheet.Cells[row, column].Style.Font.Color.SetColor(System.Drawing.Color.Red);
        }
        public void setFontColorAndBg_DeepSkyBlue(ExcelWorksheet sheet, int row, int column)
        {
            sheet.Cells[row, column].Style.Font.Bold = true;
            sheet.Cells[row, column].Style.Font.Color.SetColor(System.Drawing.Color.White);
            sheet.Cells[row, column].Style.Fill.PatternType = ExcelFillStyle.Solid;
            sheet.Cells[row, column].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.DeepSkyBlue);
            sheet.Cells[row, column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        }
        public void setFontColorAndBg_Blue(ExcelWorksheet sheet, int row, int column)
        {
            sheet.Cells[row, column].Style.Font.Bold = true;
            sheet.Cells[row, column].Style.Font.Color.SetColor(System.Drawing.Color.White);
            sheet.Cells[row, column].Style.Fill.PatternType = ExcelFillStyle.Solid;
            sheet.Cells[row, column].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Blue);
            sheet.Cells[row, column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        }
        public void setMerge_label(ExcelWorksheet sheet, int start_row, int end_row, int start_column, int end_column)
        {
            for (; start_column <= end_column; start_column++)
            {
                sheet.Cells[start_row, start_column, end_row, start_column].Merge = true;
            }
        }
        public void setBroder_red(ExcelWorksheet sheet, int row, int start_column, int end_column)
        {
            for (; start_column <= end_column; start_column++)
            {
                sheet.Cells[row, start_column].Style.Border.Top.Style = ExcelBorderStyle.Thick;
                sheet.Cells[row, start_column].Style.Border.Top.Color.SetColor(System.Drawing.Color.Red);
            }
        }
        /// <summary>
        /// excel 換行設定 
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="row"></param>
        /// <param name="start_column"></param>
        /// <param name="end_column"></param>
        public void setWrapText(ExcelWorksheet sheet, int row, int start_column, int end_column)
        {
            for (; start_column <= end_column; start_column++)
            {
                sheet.Cells[row, start_column].Style.WrapText = true;
            }
        }
    }
    public class PQList
    {
        public int p_id { get; set; }
        public decimal qty { get; set; }
    }
    public class SalesList
    {
        public string Name { get; set; }
        public IList<ProductList> items { get; set; }
    }
    public class ProductList
    {
        public int product_id { get; set; }
        public string product_name { get; set; }
        public bool have { get; set; }
        public decimal Sum { get; set; }
    }
    public class ParmGetAllPurchase
    {
        public DateTime? start_date { get; set; }
        public DateTime? end_date { get; set; }
        public string keyword { get; set; }
        public int? source { get; set; }
        public int? state { get; set; }
    }
    public class ParmGetSettleData
    {
        public int main_id { get; set; }
    }
}