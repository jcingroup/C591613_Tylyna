using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(BannerMetadata))]
    public partial class Banner
    {
        public string img_src { get; set; }
        private class BannerMetadata
        {
        }
    }
}

