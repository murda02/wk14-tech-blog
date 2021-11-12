console.log("post connencted")
const entryFormHandler = async () => {
   
    console.log("gotem")
    const title = document.querySelector('#post-title').value.trim();
    const content = document.querySelector('#post-content').value.trim();
  console.log(title, content)
    if (title && content) {
      console.log(title, content);

      const response = await fetch('/api/blog-entries', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      // if (response.ok) {
      //   document.location.replace('/login');
      // } else {
      //   alert(response.statusText);
      // }
    }
  };
  
  document.querySelector('#subBtn').addEventListener('click', () => { console.log("clicked");entryFormHandler()});