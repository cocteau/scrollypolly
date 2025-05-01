<script>
  import { onMount } from 'svelte';
  import Scroller from './components/Scroller.svelte';
  import Section from './components/Section.svelte';
  import VisualizationWrapper from './components/VisualizationWrapper.svelte';
  
  // Your Datawrapper embed URLs
  const graphics = [
    {
      id: 'graphic-1',
      url: 'https://datawrapper.dwcdn.net/YOURDATAWRAPPERURL1/1/',
      alt: 'Description of your first visualization',
      title: 'First Visualization'
    },
    {
      id: 'graphic-2',
      url: 'https://datawrapper.dwcdn.net/YOURDATAWRAPPERURL2/1/',
      alt: 'Description of your second visualization',
      title: 'Second Visualization'
    }
  ];
  
  // Text sections that will scroll alongside graphics
  const sections = [
    {
      id: 'section-1',
      title: 'First Section',
      text: 'This is the first section of your scrollytelling experience. As the user scrolls, this text will move while the graphic stays fixed.',
      graphicId: 'graphic-1'
    },
    {
      id: 'section-2',
      title: 'Second Section',
      text: 'As the user continues to scroll, new text appears. The graphic remains the same until we reach a transition point.',
      graphicId: 'graphic-1'
    },
    {
      id: 'section-3',
      title: 'Third Section',
      text: 'Now we transition to a new graphic as this text scrolls into view. The previous graphic and its associated text have moved off screen.',
      graphicId: 'graphic-2'
    },
    {
      id: 'section-4',
      title: 'Fourth Section',
      text: 'The final section continues with the second graphic. After this, both will lock and move off screen together.',
      graphicId: 'graphic-2'
    }
  ];
  
  let activeSection = 0;
  let activeGraphic = graphics[0];
  
  // Update the active section and corresponding graphic
  function updateActiveSection(index) {
    activeSection = index;
    // Find the corresponding graphic for this section
    const section = sections[index];
    const graphicObj = graphics.find(g => g.id === section.graphicId);
    if (graphicObj) {
      activeGraphic = graphicObj;
    }
  }
</script>

<main>
  <Scroller bind:activeSection={activeSection} on:sectionChange={e => updateActiveSection(e.detail)}>
    <div slot="background">
      <VisualizationWrapper graphic={activeGraphic} />
    </div>
    
    <div slot="foreground">
      {#each sections as section, i}
        <Section
          id={section.id}
          title={section.title}
          text={section.text}
          isActive={i === activeSection}
        />
      {/each}
    </div>
  </Scroller>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
