import { useEffect, useState } from 'react';
import { getAllServices, createService, updateService, deleteService } from '../../api';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';
import '../admin/AdminDashboard.css';
import './AdminServices.css';

const EMPTY = { name: '', description: '', price: '', duration: '', icon: '🔧', category: 'General', isActive: true, isFeatured: false };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchServices = () => {
    getAllServices()
      .then(({ data }) => setServices(data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration) return toast.error('Fill required fields');
    try {
      if (editId) {
        await updateService(editId, form);
        toast.success('Service updated');
      } else {
        await createService(form);
        toast.success('Service created');
      }
      setForm(EMPTY);
      setEditId(null);
      fetchServices();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const handleEdit = (s) => {
    setForm({ name: s.name, description: s.description, price: s.price, duration: s.duration, icon: s.icon, category: s.category, isActive: s.isActive, isFeatured: s.isFeatured });
    setEditId(s._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try { await deleteService(id); toast.success('Deleted'); fetchServices(); }
    catch { toast.error('Failed'); }
  };

  const icons = ['💧','✅','❄️','🔄','⚡','📋','🔧','🛞','🔋','🛠️'];

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-topbar">
          <div className="topbar-info">Service Categories Management</div>
        </div>
        <div className="admin-body">
          <div className="page-header">
            <div>
              <h1 className="page-title">Service Management</h1>
              <div className="page-sub">Add, edit and manage all service categories</div>
            </div>
          </div>

          <div className="services-layout">
            {/* Left: services list */}
            <div className="card table-card" style={{flex:1}}>
              <div className="table-header">
                <div className="table-title">All Services</div>
                <div style={{fontSize:12,color:'var(--text-3)'}}>{services.length} services</div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Service</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6"><div className="loading-spinner"><div className="spinner"></div></div></td></tr>
                  ) : services.map((s) => (
                    <tr key={s._id}>
                      <td><div className="srv-icon-cell">{s.icon}</div></td>
                      <td>
                        <div className="t-name">{s.name}</div>
                        <div className="t-sub">{s.description?.substring(0, 40)}…</div>
                      </td>
                      <td className="t-muted">Rs. {Number(s.price).toLocaleString()}</td>
                      <td className="t-muted">{s.duration}</td>
                      <td>
                        <span className={`badge ${s.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                          {s.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="act-btn" onClick={() => handleEdit(s)} title="Edit">✏️</button>
                          <button className="act-btn delete" onClick={() => handleDelete(s._id)} title="Delete">🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right: add/edit form */}
            <div className="card srv-form-card">
              <div className="srv-form-header">
                <span>{editId ? '✏️ Edit Service' : '+ Add New Service'}</span>
                {editId && <button className="cancel-edit" onClick={() => { setForm(EMPTY); setEditId(null); }}>Cancel</button>}
              </div>
              <div className="srv-form-body">
                <div className="form-group">
                  <label className="form-label">Service Name <span style={{color:'var(--danger)'}}>*</span></label>
                  <input className="form-input" placeholder="e.g. Wheel Alignment" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} placeholder="Brief description…" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{resize:'vertical'}} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (Rs.) <span style={{color:'var(--danger)'}}>*</span></label>
                    <input className="form-input" type="number" placeholder="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration <span style={{color:'var(--danger)'}}>*</span></label>
                    <input className="form-input" placeholder="e.g. 1 hr" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {['Fluids','Brakes','AC','Tires','Electrical','General'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Icon</label>
                  <div className="icon-grid">
                    {icons.map(ic => (
                      <div key={ic} className={`icon-option ${form.icon === ic ? 'selected' : ''}`} onClick={() => setForm({...form, icon: ic})}>{ic}</div>
                    ))}
                  </div>
                </div>
                <div className="toggle-row">
                  <span className="form-label">Visible to customers</span>
                  <div className={`toggle ${form.isActive ? 'on' : ''}`} onClick={() => setForm({...form, isActive: !form.isActive})}>
                    <div className="toggle-knob"></div>
                  </div>
                </div>
                <div className="toggle-row">
                  <span className="form-label">Featured on homepage</span>
                  <div className={`toggle ${form.isFeatured ? 'on' : ''}`} onClick={() => setForm({...form, isFeatured: !form.isFeatured})}>
                    <div className="toggle-knob"></div>
                  </div>
                </div>
                <button className="btn-primary" style={{width:'100%', justifyContent:'center', marginTop:8}} onClick={handleSave}>
                  {editId ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
