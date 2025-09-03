<template>
  <div
    ref="cardRef"
    class="relative overflow-hidden"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
    :style="cardStyle"
  >
    <!-- Content Slot -->
    <slot />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
interface Props {
  // Spotlight size (radius)
  spotlightSize?: number;
  // Light intensity (opacity)
  intensity?: number;
  // Light colors (from center to edge)
  lightColorCenter?: string;
  lightColorEdge?: string;
  // Animation speed
  animationSpeed?: number;
}

const props = withDefaults(defineProps<Props>(), {
  spotlightSize: 200,
  intensity: 0.15,
  lightColorCenter: "rgba(16, 185, 129, 0.4)",
  lightColorEdge: "rgba(16, 185, 129, 0.0)",
  animationSpeed: 200,
});

const cardRef = ref<HTMLElement>();
const isHovering = ref(false);
const mousePosition = ref({ x: 0, y: 0 });

const cardStyle = computed(() => {
  if (!isHovering.value) {
    return {
      background: "transparent",
      transition: `background ${props.animationSpeed}ms ease-out`,
    };
  }

  const x = mousePosition.value.x;
  const y = mousePosition.value.y;

  return {
    background: `radial-gradient(${props.spotlightSize}px circle at ${x}px ${y}px, ${props.lightColorCenter} 0%, ${props.lightColorEdge} 50%, transparent 100%)`,
    transition: `background ${props.animationSpeed}ms ease-out`,
  };
});

const handleMouseMove = (event: MouseEvent) => {
  if (!cardRef.value) return;

  const rect = cardRef.value.getBoundingClientRect();
  mousePosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

const handleMouseEnter = () => {
  isHovering.value = true;
};

const handleMouseLeave = () => {
  isHovering.value = false;
};
</script>
