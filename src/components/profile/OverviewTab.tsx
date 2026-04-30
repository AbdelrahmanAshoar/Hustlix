import { useAuth } from "@/contexts/AuthContext";

const Overview = ({ data }) => {
  const { userRole } = useAuth();
  const { professionalInfo } = data;

  return (
    <div className="space-y-6">

      {/* Job Title */}
      <div className="p-4 rounded-xl border border-gray-100" style={{ background: "#f8fafc" }}>
        <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "#94a3b8" }}>Job Title</p>
        <p className="text-gray-800 font-medium">{professionalInfo?.jobTitle || "Not specified"}</p>
      </div>

      {/* About */}
      <div className="p-4 rounded-xl border border-gray-100" style={{ background: "#f8fafc" }}>
        <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "#94a3b8" }}>About</p>
        <p className="text-gray-700 leading-relaxed text-sm">{professionalInfo?.about || "No description"}</p>
      </div>

      {/* Freelancer Fields */}
      {userRole === "Freelancer" && (
        <>
          {/* CV */}
          <div className="p-4 rounded-xl border border-gray-100" style={{ background: "#f8fafc" }}>
            <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "#94a3b8" }}>CV</p>
            {professionalInfo?.cvUrl ? (
              <a
                href={`http://proafree.runasp.net${professionalInfo.cvUrl}`}
                target="_blank"
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all"
                style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                View CV
              </a>
            ) : (
              <p className="text-sm text-gray-400">No CV uploaded</p>
            )}
          </div>
        </>
      )}

      {/* Client Fields */}
      {userRole === "Client" && (
        <div className="p-4 rounded-xl border border-gray-100" style={{ background: "#f8fafc" }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "#94a3b8" }}>Company</p>
          <p className="text-gray-800 font-medium">{professionalInfo?.company || "No info"}</p>
        </div>
      )}
    </div>
  );
};

export default Overview;
