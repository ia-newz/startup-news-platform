export default function Custom500() {
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'}}>
      <div style={{maxWidth:560,textAlign:'center'}}>
        <div style={{fontSize:64, fontWeight:800, marginBottom:12}}>500</div>
        <h1 style={{fontSize:24, fontWeight:700, marginBottom:8}}>Something went wrong</h1>
        <p style={{color:'#6b7280'}}>An unexpected error occurred. Please try again later.</p>
      </div>
    </div>
  )
}
