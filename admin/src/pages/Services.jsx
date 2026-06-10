import { useEffect, useState } from 'react';
import { getAllServices, createService, updateService, deleteService } from '../api';
import AdminLayout from '../components/AdminLayout';
import toast from 'react-hot-toast';

const EMPTY = { name:'', description:'', price:'', duration:'', icon:'🔧', category:'General', isActive:true, isFeatured:false };
const CATS  = ['Fluids','Brakes','AC','Tires','Electrical','General'];
const ICONS = ['💧','✅','❄️','🔄','⚡','📋','🔧','🛞','🔋','🛠️','🪛','🔩'];

export default function Services() {
  const [services, setServices] = useState([]);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const fetch = () => {
    setLoading(true);
    getAllServices()
      .then(({ data }) => setServices(data))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const save = async () => {
    if (!form.name || !form.price || !form.duration) return toast.error('Name, price & duration are required');
    setSaving(true);
    try {
      if (editId) { await updateService(editId, form); toast.success('Service updated ✓'); }
      else        { await createService(form);          toast.success('Service created ✓'); }
      setForm(EMPTY); setEditId(null); fetch();
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const edit = (s) => {
    setForm({ name:s.name, description:s.description, price:s.price, duration:s.duration, icon:s.icon, category:s.category, isActive:s.isActive, isFeatured:s.isFeatured });
    setEditId(s._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try { await deleteService(id); toast.success('Deleted'); fetch(); }
    catch { toast.error('Delete failed'); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <AdminLayout
      title="Service Management"
      subtitle="Add, edit and manage all service categories"
    >
      <div style={{display:'grid',gridTemplateColumns:'1fr 290px',gap:16,alignItems:'flex-start'}}>

        {/* ── Service list ── */}
        <div className="card" style={{overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:'1px solid var(--border)'}}>
            <div style={{fontSize:15,fontWeight:700,color:'var(--text-1)'}}>All Services</div>
            <span style={{fontSize:12,color:'var(--text-3)'}}>{services.length} services</span>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th></th><th>Service</th><th>Price</th>
                <th>Duration</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6"><div className="loader"><div className="spinner"></div></div></td></tr>
              ) : services.map(s => (
                <tr key={s._id} style={editId===s._id ? {background:'#FDFCFF'} : {}}>
                  <td>
                    <div style={{width:32,height:32,background:'var(--brand-light)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>
                      {s.icon}
                    </div>
                  </td>
                  <td>
                    <div style={{fontWeight:600}}>{s.name}</div>
                    <div style={{fontSize:11,color:'var(--text-3)'}}>{s.description?.slice(0,44)}…</div>
                  </td>
                  <td style={{fontSize:13,fontWeight:600,color:'var(--text-1)'}}>Rs. {Number(s.price).toLocaleString()}</td>
                  <td style={{fontSize:12,color:'var(--text-2)'}}>{s.duration}</td>
                  <td>
                    <span className={`badge ${s.isActive?'badge-active':'badge-inactive'}`}>
                      {s.isActive?'Active':'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="act-btns">
                      <button className="act-btn" title="Edit" onClick={() => edit(s)}>✏️</button>
                      <button className="act-btn del" title="Delete" onClick={() => remove(s._id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Most booked */}
          <div style={{padding:'14px 18px',borderTop:'1px solid var(--border)'}}>
            <div style={{fontSize:12,fontWeight:700,color:'var(--text-2)',marginBottom:10}}>Most Booked</div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {services.slice(0,4).map((s,i) => (
                <div key={s._id} style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{fontSize:11,fontWeight:700,color:'var(--brand)',width:16,textAlign:'center'}}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:'var(--text-1)',marginBottom:3}}>{s.name}</div>
                    <div style={{height:3,background:'var(--surface2)',borderRadius:2}}>
                      <div style={{height:3,background:'var(--brand)',borderRadius:2,width:`${Math.min(100,((s.bookingCount||0)/50)*100)}%`}}></div>
                    </div>
                  </div>
                  <div style={{fontSize:11,color:'var(--text-3)',whiteSpace:'nowrap'}}>{s.bookingCount||0} bookings</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Add/Edit form ── */}
        <div className="card" style={{overflow:'hidden',position:'sticky',top:60}}>
          <div style={{background:'var(--brand-light)',padding:'13px 16px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:13,fontWeight:700,color:'#3C3489'}}>{editId ? '✏️ Edit Service' : '+ Add New Service'}</span>
            {editId && <button style={{fontSize:11,color:'var(--text-3)',background:'none',border:'none',cursor:'pointer'}} onClick={() => { setForm(EMPTY); setEditId(null); }}>Cancel</button>}
          </div>
          <div style={{padding:16}}>
            <div className="form-group">
              <label className="form-label">Service name *</label>
              <input className="form-input" placeholder="e.g. Wheel Alignment" value={form.name} onChange={e=>set('name',e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} style={{resize:'vertical'}} placeholder="Brief description…" value={form.description} onChange={e=>set('description',e.target.value)} />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div className="form-group">
                <label className="form-label">Price (Rs.) *</label>
                <input className="form-input" type="number" placeholder="0" value={form.price} onChange={e=>set('price',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Duration *</label>
                <input className="form-input" placeholder="e.g. 1 hr" value={form.duration} onChange={e=>set('duration',e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={e=>set('category',e.target.value)}>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Icon</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:5}}>
                {ICONS.map(ic=>(
                  <div key={ic}
                    onClick={()=>set('icon',ic)}
                    style={{
                      aspectRatio:1, borderRadius:8, cursor:'pointer',
                      border:`1.5px solid ${form.icon===ic?'var(--brand)':'var(--border)'}`,
                      background: form.icon===ic ? 'var(--brand-light)' : 'var(--surface2)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:18, transition:'all .1s'
                    }}>{ic}</div>
                ))}
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0'}}>
              <label className="form-label" style={{margin:0}}>Visible to customers</label>
              <div className={`toggle ${form.isActive?'on':''}`} onClick={()=>set('isActive',!form.isActive)}>
                <div className="toggle-knob"></div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',marginBottom:12}}>
              <label className="form-label" style={{margin:0}}>Featured on homepage</label>
              <div className={`toggle ${form.isFeatured?'on':''}`} onClick={()=>set('isFeatured',!form.isFeatured)}>
                <div className="toggle-knob"></div>
              </div>
            </div>
            <button className="btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={save} disabled={saving}>
              {saving ? 'Saving…' : editId ? 'Update Service' : 'Save Service'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
