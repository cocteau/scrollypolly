<script>
  export let graphic;
  
  // Function to safely embed Datawrapper iframes
  function createIframeSrc(url) {
    // Extract just the necessary parts of the URL to create a secure embed
    try {
      const urlObj = new URL(url);
      return `${urlObj.origin}${urlObj.pathname}${urlObj.search}`;
    } catch (e) {
      console.error("Invalid URL:", url);
      return '';
    }
  }
</script>

<div class="graphic-container" id={graphic.id}>
  <iframe
    title={graphic.alt}
    src={createIframeSrc(graphic.url)}
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

<style>
  .graphic-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  iframe {
    width: 80%;
    height: 80%;
    max-width: 900px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
</style>
