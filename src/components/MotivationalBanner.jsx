export default function MotivationalBanner({ name = 'Katyani' }) {
  return (
    <div className="relative overflow-hidden rounded-xl3 bg-gradient-to-r from-primary-soft via-lavender to-primary-soft px-6 py-7 sm:px-9">
      {/* decorative circles */}
      <div className="pointer-events-none absolute -left-8 -top-10 h-32 w-32 rounded-full bg-card/40" />
      <div className="pointer-events-none absolute -right-10 -bottom-14 h-40 w-40 rounded-full bg-primary/10" />
      <div className="pointer-events-none absolute right-24 top-4 h-6 w-6 rounded-full bg-card/50" />

      <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="font-display text-xl leading-snug text-plum sm:text-2xl">
          A well planned month
          <br />
          leads to a better you <span className="text-primary">♡</span>
        </p>
        <p className="font-display text-lg text-plum/90 sm:text-right sm:text-xl">
          Keep going,
          <br />
          {name} <span className="text-primary">♡</span>
        </p>
      </div>
    </div>
  )
}
