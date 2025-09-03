// Configuration for Glass Card Spotlight Effect
export const spotlightConfig = {
  // Default configuration for login card
  login: {
    spotlightSize: 200,
    intensity: 0.1,
    lightColorCenter: "rgba(16, 185, 129, 0.7)",
    lightColorEdge: "rgba(16, 185, 129, 0.1)",
    animationSpeed: 150,
  },

  // Alternative configurations
  configs: {
    // Subtle white glow
    subtle: {
      spotlightSize: 200,
      intensity: 0.1,
      lightColorCenter: "rgba(255, 255, 255, 0.2)",
      lightColorEdge: "rgba(255, 255, 255, 0.02)",
      animationSpeed: 200,
    },

    // Intense blue glow
    intense: {
      spotlightSize: 300,
      intensity: 0.3,
      lightColorCenter: "rgba(59, 130, 246, 0.4)",
      lightColorEdge: "rgba(59, 130, 246, 0.05)",
      animationSpeed: 100,
    },

    // Purple magic
    magic: {
      spotlightSize: 280,
      intensity: 0.25,
      lightColorCenter: "rgba(147, 51, 234, 0.35)",
      lightColorEdge: "rgba(147, 51, 234, 0.03)",
      animationSpeed: 120,
    },

    // Golden glow
    golden: {
      spotlightSize: 260,
      intensity: 0.18,
      lightColorCenter: "rgba(251, 191, 36, 0.3)",
      lightColorEdge: "rgba(251, 191, 36, 0.04)",
      animationSpeed: 180,
    },

    // Pink aurora
    aurora: {
      spotlightSize: 320,
      intensity: 0.22,
      lightColorCenter: "rgba(236, 72, 153, 0.3)",
      lightColorEdge: "rgba(236, 72, 153, 0.02)",
      animationSpeed: 160,
    },
  },
};
