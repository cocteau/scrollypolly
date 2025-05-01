<script>
  export let id;
  export let title;
  export let text;
  export let isActive = false;
</script>

<section 
  id={id} 
  class="section {isActive ? 'active' : ''}"
>
  <div class="content">
    <h2>{title}</h2>
    <p>{text}</p>
  </div>
</section>

<style>
  .section {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.3;
    transition: opacity 0.5s ease;
  }
  
  .section.active {
    opacity: 1;
  }
  
  .content {
    background: rgba(255, 255, 255, 0.8);
    padding: 2rem;
    border-radius: 4px;
    max-width: 40rem;
    margin: 0 auto;
    pointer-events: auto;
  }
</style>
