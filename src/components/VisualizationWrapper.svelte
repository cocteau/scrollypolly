<script>
  import { LayerCake, ScaledSvg } from 'layercake';
  import DatawrapperGraphic from './DatawrapperGraphic.svelte';
  
  export let graphic;
  
  // You can add any data transformations or additional data here
  // that LayerCake might need for supplemental visualizations
  let chartData = [];
  
  // Define dimensions for the visualization
  const dimensions = {
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.7
  };

  let useLayerCake = false; // Set to true to use LayerCake instead of direct embed
</script>

<div class="visualization-container">
  {#if graphic}
    {#if !useLayerCake}
      <!-- Option 1: Direct Datawrapper embed -->
      <DatawrapperGraphic {graphic} />
    {:else}
      <!-- Option 2: LayerCake visualization with Datawrapper as a component -->
      <div class="layercake-container">
        <LayerCake
          data={chartData}
          x={d => d.x}
          y={d => d.y}
          padding={{ top: 20, right: 20, bottom: 30, left: 40 }}
          {...dimensions}
        >
          <ScaledSvg>
            <DatawrapperGraphic {graphic} />
            
            <!-- Add additional LayerCake visualization components here if needed -->
          </ScaledSvg>
        </LayerCake>
      </div>
    {/if}
  {/if}
</div>

<style>
  .visualization-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .layercake-container {
    width: 100%;
    height: 100%;
  }
</style>