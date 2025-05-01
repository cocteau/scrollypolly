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
</script>

<div class="visualization-container">
  <!-- Use either a direct Datawrapper embed OR a LayerCake viz -->
  {#if graphic}
    <!-- Option 1: Direct Datawrapper embed -->
    <DatawrapperGraphic {graphic} />
    
    <!-- Option 2: LayerCake visualization with Datawrapper as a component -->
    <!-- Uncomment this section if you want to use LayerCake's features
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
          
          <!-- You can add additional LayerCake visualization components here -->
          <!-- <AxisX /> -->
          <!-- <AxisY /> -->
          <!-- <Line /> -->
          <!-- etc. -->
        </ScaledSvg>
      </LayerCake>
    </div>
    -->
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
