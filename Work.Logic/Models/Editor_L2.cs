using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(Editor_L2Metadata))]
    public partial class Editor_L2
    {
        private class Editor_L2Metadata
        {
            [JsonIgnore()]
            public virtual Editor_L1 Editor_L1 { get; set; }
        }
    }
}

