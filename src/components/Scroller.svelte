<script>
  import { onMount, createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  export let activeSection = 0;
  
  let foreground;
  let sections = [];
  let containerHeight;
  let screenHeight;
  
  onMount(() => {
    // Get all section elements
    sections = foreground.querySelectorAll('section');
    screenHeight = window.innerHeight;
    
    // Calculate total scroll height needed
    containerHeight = sections.length * screenHeight;
    
    // Set initial container height
    foreground.style.height = `${containerHeight}px`;
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  
  function handleScroll() {
    const scrollPosition = window.scrollY;
    
    // Calculate which section should be active based on scroll position
    const newActiveSection = Math.floor(scrollPosition / screenHeight);
    
    if (newActiveSection !== activeSection && newActiveSection >= 0 && newActiveSection < sections.length) {
      activeSection = newActiveSection;
      dispatch('sectionChange', activeSection);
    }
  }
</script>

<div class="scroller">
  <div class="background">
    <slot name="background"></slot>
  </div>
  
  <div class="foreground" bind:this={foreground}>
    <slot name="foreground"></slot>
  </div>
</div>

<style>
  .scroller {
    position: relative;
    width: 100%;
  }
  
  .background {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  
  .foreground {
    position: relative;
    z-index: 2;
    pointer-events: none;
  }
</style>
