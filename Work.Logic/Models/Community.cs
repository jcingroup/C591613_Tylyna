using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(CommunityMetadata))]
    public partial class Community
    {
        public string imgurl_CommunityList { get; set; }
        public string[] imgurl_CommunityDoor { get; set; }
        public string[] imgurl_CommunityPublic { get; set; }
        private class CommunityMetadata
        {
            [JsonIgnore()]
            public virtual ICollection<Matter> Matter { get; set; }
            [JsonIgnore()]
            public virtual ICollection<Community_News> Community_News { get; set; }
            [JsonIgnore()]
            public virtual ICollection<Community_Banner> Community_Banner { get; set; }
        }
    }
}

