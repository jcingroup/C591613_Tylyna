﻿using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using ProcCore.Business.LogicConect;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DotWeb
{

    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            return userIdentity;
        }
        [NotMapped]
        public IList<UserRoleInfo> role_array { get; set; }
        public int department_id { get; set; }
        /// <summary>
        /// 真實姓名，非帳號登錄。
        /// </summary>
        /// 
        [Required(ErrorMessage = "姓名欄位需填寫。")]
        [MaxLength(32, ErrorMessage = "姓名欄位長度超過32。")]
        public string user_name_c { get; set; }
        public int sort { get; set; }
        public int? community_id { get; set; }
    }
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("name=IdentityDB", false)
        {
            //此為Aps.Net Identity User Code First 開發使用 
        }

        public ApplicationDbContext(string connectionstring)
            : base(connectionstring, throwIfV1Schema: false)
        {

        }

        public static ApplicationDbContext Create()
        {
            string connstr = LogicCenter.GetDB0ConnectionString(CommSetup.CommWebSetup.DB0_CodeString);
            return new ApplicationDbContext(connstr);
        }
    }
    public class UserRoleInfo
    {
        public string role_id { get; set; }
        public string role_name { get; set; }
        public bool role_use { get; set; }
    }
    public class RegisterViewModel
    {
        [Required]
        [Display(Name = "帳號")]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "電子郵件")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "{0} 的長度至少必須為 {2} 個字元。", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "密碼")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "確認密碼")]
        [Compare("Password", ErrorMessage = "密碼和確認密碼不相符。")]
        public string ConfirmPassword { get; set; }


        public UserRoleInfo[] role_array { get; set; }
    }
    public class ResetPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "電子郵件")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "{0} 的長度至少必須為 {2} 個字元。", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "密碼")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "確認密碼")]
        [Compare("Password", ErrorMessage = "密碼和確認密碼不相符。")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(Name = "電子郵件")]
        public string Email { get; set; }
    }
    public class ChangePasswordViewModel
    {
        [Required]
        [StringLength(100, ErrorMessage = "{0} 的長度至少必須為 {2} 個字元。", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "密碼")]
        public string OriginPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "{0} 的長度至少必須為 {2} 個字元。", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "密碼")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "確認密碼")]
        [Compare("Password", ErrorMessage = "密碼和確認密碼不相符。")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }
    public class ManageUserViewModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "目前密碼")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "{0} 的長度至少必須為 {2} 個字元。", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "新密碼")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "確認新密碼")]
        [Compare("NewPassword", ErrorMessage = "新密碼與確認密碼不相符。")]
        public string ConfirmPassword { get; set; }
    }
}