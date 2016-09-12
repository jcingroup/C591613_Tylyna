using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(Community_BannerMetadata))]
    public partial class Community_Banner
    {
        public string imgurl_CommunityBannerPhoto_1 { get; set; }

        private class Community_BannerMetadata
        {
            [JsonIgnore()]
            public virtual Community Community { get; set; }
        }
    }
}

