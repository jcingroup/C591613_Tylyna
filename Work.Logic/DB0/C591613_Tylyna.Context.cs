﻿//------------------------------------------------------------------------------
// <auto-generated>
//     這個程式碼是由範本產生。
//
//     對這個檔案進行手動變更可能導致您的應用程式產生未預期的行為。
//     如果重新產生程式碼，將會覆寫對這個檔案的手動變更。
// </auto-generated>
//------------------------------------------------------------------------------

namespace ProcCore.Business.DB0
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class C591613_TylynaEntities : DbContext
    {
        public C591613_TylynaEntities()
            : base("name=C591613_TylynaEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<C__MigrationHistory> C__MigrationHistory { get; set; }
        public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaims> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogins> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<Department> Department { get; set; }
        public virtual DbSet<i_Currency> i_Currency { get; set; }
        public virtual DbSet<i_IDX> i_IDX { get; set; }
        public virtual DbSet<i_Lang> i_Lang { get; set; }
        public virtual DbSet<i_Parm> i_Parm { get; set; }
        public virtual DbSet<i_SN> i_SN { get; set; }
        public virtual DbSet<i_UserLoginLog> i_UserLoginLog { get; set; }
        public virtual DbSet<Menu> Menu { get; set; }
        public virtual DbSet<ProductKind> ProductKind { get; set; }
        public virtual DbSet<Product> Product { get; set; }
        public virtual DbSet<Customer> Customer { get; set; }
        public virtual DbSet<ProductDetail> ProductDetail { get; set; }
        public virtual DbSet<PurchaseDetail> PurchaseDetail { get; set; }
        public virtual DbSet<TimeLinessCode> TimeLinessCode { get; set; }
        public virtual DbSet<Banner> Banner { get; set; }
        public virtual DbSet<News> News { get; set; }
        public virtual DbSet<FAQ> FAQ { get; set; }
        public virtual DbSet<Editor_L2> Editor_L2 { get; set; }
        public virtual DbSet<Editor_L1> Editor_L1 { get; set; }
        public virtual DbSet<Discount> Discount { get; set; }
        public virtual DbSet<Purchase> Purchase { get; set; }
        public virtual DbSet<Shipment> Shipment { get; set; }
    }
}
