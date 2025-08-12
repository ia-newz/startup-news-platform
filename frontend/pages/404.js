export default function Custom404() {
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'}}>
      <div style={{maxWidth:560,textAlign:'center'}}>
        <div style={{fontSize:64, fontWeight:800, marginBottom:12}}>404</div>
        <h1 style={{fontSize:24, fontWeight:700, marginBottom:8}}>Page not found</h1>
        <p style={{color:'#6b7280'}}>The page you are looking for does not exist or has been moved.</p>
      </div>
    </div>
  )
}
