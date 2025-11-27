import styles from './AboutOverview.module.css'

export function AboutOverview() {
  return (
    <section className={styles.section}>
      <p className={styles.text}>
        DnA is a research–driven platform dedicated to human well-being,
        cognitive performance, and applied neuroscience. Our mission is to take
        complex scientific literature—often confined to academic journals—and
        transform it into clear, actionable insights that anyone can apply to
        improve focus, sleep, emotional balance, learning, and physical
        performance. We focus on clarity without sacrificing rigor, and on
        usefulness without diluting scientific accuracy.
      </p>

      <p className={styles.text}>
        We believe science should be accessible, transparent, and free from
        pseudoscientific narratives that dominate the modern wellness world.
        Every topic we cover is grounded in peer-reviewed research,
        meta-analyses, and established physiological mechanisms. Our goal is not
        to offer quick fixes, but to empower readers with a realistic,
        evidence-based understanding of how the brain and body work—and how to
        improve them.
      </p>

      <p className={styles.text}>
        Our editorial approach follows three guiding principles: accuracy,
        responsibility, and clarity. We prioritize research that is
        reproducible, statistically meaningful, and practically relevant. When
        evidence is inconclusive, we explain why. When a topic requires nuance,
        we provide it. And when popular claims contradict scientific consensus,
        we say so openly. DnA is committed to offering information that respects
        both the intelligence of the reader and the integrity of the scientific
        method.
      </p>

      <p className={styles.text}>
        Beyond free educational content, DnA introduces limited NFT-based access
        to exclusive deep-dive articles. These tokens are not merely
        collectibles—they serve as verifiable access keys on the blockchain,
        ensuring that ownership cannot be forged or manipulated. This approach
        allows us to explore a new model of digital publishing where readers can
        truly own their access, support the platform, and unlock advanced
        content without subscriptions or centralized gatekeeping.
      </p>

      <p className={styles.text}>
        Under the hood, DnA is built on decentralized technologies that ensure
        persistence, transparency, and autonomy. Smart contracts handle access
        logic, IPFS distributes content, and the platform integrates seamlessly
        with modern Web3 tools. While the scientific mission is our core,
        blockchain provides the infrastructure that protects the long-term
        independence and resilience of the project.
      </p>

      <p className={styles.text}>
        Our long-term vision is to create a trusted space where science-based
        guidance meets modern technology—a place where individuals can learn,
        grow, and improve themselves with accurate information and complete
        autonomy over their data and digital assets. DnA combines rigorous
        neuroscience with decentralized infrastructure to build a new model of
        scientific publishing: open, verifiable, sustainable, and focused on
        human performance.
      </p>
    </section>
  )
}
