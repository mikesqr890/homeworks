import { useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'


class TreeNode {
  constructor(title, link, component) {
    this.title = title
    this.link = link
    this.component = component
    this.children = []
  }


  addChild(node) {
    this.children.push(node)
    return node
  }

  flatten() {
    return [this, ...this.children.flatMap((child) => child.flatten())]
  }
}


const Page = ({ title, text }) => (
  <>
    <h1>{title}</h1>
    <p>{text}</p>
  </>
)

const Profile = () => <Page title="Profile" text="Your public profile." />
const Messages = () => <Page title="Messages" text="Your inbox is empty." />
const Settings = () => <Page title="Settings" text="General settings." />
const Account = () => <Page title="Account" text="Manage your account." />
const SettingsProfile = () => (
  <Page title="Settings / Profile" text="Edit your profile data." />
)
const Security = () => (
  <Page title="Security & Privacy" text="Two-factor auth and privacy." />
)
const Password = () => <Page title="Password" text="Change your password." />
const Notification = () => (
  <Page title="Notification" text="Choose how you get notified." />
)
const Help = () => <Page title="Help" text="How can we help you?" />
const Faqs = () => <Page title="FAQ's" text="Frequently asked questions." />
const Ticket = () => <Page title="Submit a Ticket" text="Tell us your problem." />
const Network = () => <Page title="Network Status" text="All systems operational." />
const Logout = () => <Page title="Logout" text="See you soon!" />


const buildMenuTree = () => {
  const root = new TreeNode('Root', '/', null)

  root.addChild(new TreeNode('Profile', '/profile', Profile))
  root.addChild(new TreeNode('Messages', '/messages', Messages))

  const settings = root.addChild(new TreeNode('Settings', '/settings', Settings))
  settings.addChild(new TreeNode('Account', '/settings/account', Account))
  settings.addChild(new TreeNode('Profile', '/settings/profile', SettingsProfile))
  settings.addChild(new TreeNode('Security & Privacy', '/settings/security', Security))
  settings.addChild(new TreeNode('Password', '/settings/password', Password))
  settings.addChild(new TreeNode('Notification', '/settings/notification', Notification))

  const help = root.addChild(new TreeNode('Help', '/help', Help))
  help.addChild(new TreeNode("FAQ's", '/help/faqs', Faqs))
  help.addChild(new TreeNode('Submit a Ticket', '/help/ticket', Ticket))
  help.addChild(new TreeNode('Network Status', '/help/network', Network))

  root.addChild(new TreeNode('Logout', '/logout', Logout))

  return root
}

const menuTree = buildMenuTree()


const MenuItem = ({ node, depth }) => {
  const { pathname } = useLocation()
  const isGroup = node.children.length > 0

  const [open, setOpen] = useState(pathname.startsWith(node.link + '/'))

  const indent = { paddingLeft: 16 + depth * 16 }

  return (
    <li>
      {isGroup ? (
        <button
          className="menu__item menu__item--group"
          style={indent}
          onClick={() => setOpen(!open)}
        >
          {node.title}
          <span className={'menu__arrow' + (open ? ' menu__arrow--open' : '')}>
            ▼
          </span>
        </button>
      ) : (
        <NavLink
          to={node.link}
          style={indent}
          className={({ isActive }) =>
            'menu__item' + (isActive ? ' menu__item--active' : '')
          }
        >
          {node.title}
        </NavLink>
      )}

      {isGroup && open && (
        <ul className="submenu">
          {node.children.map((child) => (
            <MenuItem key={child.link} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

const Sidebar = ({ tree }) => (
  <nav className="sidebar">
    <h2 className="sidebar__title">Menu</h2>
    <ul className="menu">
      {tree.children.map((node) => (
        <MenuItem key={node.link} node={node} depth={0} />
      ))}
    </ul>
  </nav>
)


function App() {

  const nodes = menuTree.flatten().slice(1)

  return (
    <div className="layout">
      <Sidebar tree={menuTree} />

      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          {nodes.map((node) => (
            <Route
              key={node.link}
              path={node.link}
              element={<node.component />}
            />
          ))}
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
