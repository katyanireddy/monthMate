export default function CatIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Sleeping cat illustration"
    >
      {/* body */}
      <path
        d="M20 62c0-16 12-27 30-27s34 10 38 24c2 7-3 11-9 11H28c-6 0-8-4-8-8z"
        fill="#FBE7F1"
        stroke="#ED4F86"
        strokeWidth="1.5"
      />
      {/* head */}
      <circle cx="34" cy="34" r="15" fill="#FBE7F1" stroke="#ED4F86" strokeWidth="1.5" />
      {/* ears */}
      <path d="M23 24l4 9 7-4z" fill="#FBE7F1" stroke="#ED4F86" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M45 24l-4 9-7-4z" fill="#FBE7F1" stroke="#ED4F86" strokeWidth="1.5" strokeLinejoin="round" />
      {/* closed eyes */}
      <path d="M27 35c1.5 1.5 3.5 1.5 5 0" stroke="#C23768" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M37 35c1.5 1.5 3.5 1.5 5 0" stroke="#C23768" strokeWidth="1.4" strokeLinecap="round" />
      {/* nose */}
      <path d="M34 39l-1.5 1.5h3z" fill="#ED4F86" />
      {/* tail curled around */}
      <path
        d="M84 60c10-2 16-10 13-19-2-6-8-8-11-4"
        fill="none"
        stroke="#ED4F86"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* blanket fold */}
      <path d="M20 58h68" stroke="#ED4F86" strokeWidth="1.2" strokeDasharray="2 4" strokeLinecap="round" />
      {/* zzz */}
      <text x="66" y="20" fontSize="9" fill="#ED4F86" fontFamily="Fraunces, serif">z</text>
      <text x="74" y="14" fontSize="7" fill="#ED4F86" fontFamily="Fraunces, serif">z</text>
      <text x="80" y="10" fontSize="5" fill="#ED4F86" fontFamily="Fraunces, serif">z</text>
    </svg>
  )
}
