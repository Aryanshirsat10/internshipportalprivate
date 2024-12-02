import React, { useEffect, useState } from 'react'
import SuperAdminSidebar from '../../components/SuperAdminSidebar'
import TopSuperAdminSidebar from '../../components/TopSuperAdmin'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "../../components/ui/dropdown-menu"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Pagination } from "../../components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select"
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    userId: "",
    email: "",
    password: "",
    role: [],
    status: "Active",
  });

  const [editingUser, setEditingUser] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState([
    'Artificial Intelligence & Data Science', 'Computer Engineering', 'Computer & Communication Engineering', 'Computer Science & Business Systems', 'Electronics & Computer Engineering','Electronics & Telecommunication Engineering','Electronics Engineering (VLSI Design & Technology)',
'Information Technology','Mechanical Engineering','Robotics & Artificial Intelligence'
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortColumn = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleAddUser = () => {
    setNewUser({
      name: "",
      userId: "",
      email: "",
      password: "",
      role: [],
      status: "Active",
    });
    setIsAddingUser(true);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setIsAddingUser(false);
    setEditingUser(user);
    setNewUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: [],
      status: "Active",
    });
    setEditingUser(null);
  };

  const handleSaveUser = async() => {
    if (editingUser) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/edituser/${editingUser.userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': Cookies.get('token'),
            'x-session-id': Cookies.get('sessionId'),
          },
          body: JSON.stringify({
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
          }),
        });
    
        const data = await response.json();
        if (response.ok) {
          setUsers(users.map((u) => (u.userId === editingUser.userId ? data.user : u)));
          handleCloseModal();
          toast.success('User updated successfully!');
        } else {
          toast.error('Failed to update user');
          console.error('Error updating user:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/adduser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': Cookies.get('token'),
            'x-session-id': Cookies.get('sessionId'),
          },
          body: JSON.stringify({
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role,
            department: newUser.role.includes('Student') ? newUser.department : null, // Send department only if role includes 'Student'
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          setUsers([...users, data.user]);
          handleCloseModal();
          toast.success('User added successfully!');
        } else {
          console.error('Error adding user:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    handleCloseModal();
  };  

  const handleDeactivateUser = async (user) => {
    try {
      const updatedUser = { ...user, status: user.status === "Active" ? "Inactive" : "Active" };
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': Cookies.get('token'),
          'x-session-id': Cookies.get('sessionId'),
        },
        body: JSON.stringify({status : updatedUser.status}),
      });
  
      if (response.ok) {
        setUsers(users.map((u) => (u.userId === user.userId ? updatedUser : u)));
        toast.success(`User ${updatedUser.status === "Active" ? "activated" : "deactivated"} successfully!`);
      } else {
        const data = await response.json();
        console.error('Error updating user status:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const toggleRole = (role) => {
    setNewUser((prevUser) => {
      const hasRole = prevUser.role.includes(role);
      return {
        ...prevUser,
        role: hasRole ? prevUser.role.filter((r) => r !== role) : [...prevUser.role, role],
      };
    });
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name ? user.name.toLowerCase() : '';
    const email = user.email ? user.email.toLowerCase() : '';
    const roles = Array.isArray(user.role) ? user.role.map((r) => r.toLowerCase()) : [user.role.toLowerCase()];
    const status = user.status ? user.status.toLowerCase() : '';

    const matchesRole = roles.some((role) => role.includes(filterText.toLowerCase()));

    return (
      name.includes(filterText.toLowerCase()) ||
      email.includes(filterText.toLowerCase()) ||
      matchesRole ||
      status.includes(filterText.toLowerCase())
    );
  });

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  useEffect(() => {
    // Fetch existing data from the database when the component mounts
    const fetchExistingData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getusers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': Cookies.get('token'),
            'x-session-id': Cookies.get('sessionId'),
          },
        });
        const data = await response.json();
        console.log(data);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching existing data:', error);
      }
    };

    fetchExistingData();
  }, []);

  return (
    <div className='min-[990px]:flex w-full h-screen'>
      <div className='min-[990px]:flex min-[990px]:flex-col bg-red-50 p-5 w-[20%] hidden'>
        <SuperAdminSidebar />
      </div>
      <div className='flex flex-col bg-red-50 h-fit min-[990px]:p-5 p-2 min-[990px]:hidden items-center'>
        <h3 className='text-xl font-semibold'>Internship Portal</h3>
        <div className='overflow-x-scroll w-screen pt-5'>
          <TopSuperAdminSidebar />
        </div>
      </div>
      <div className='rounded-lg bg-slate-100 min-[990px]:w-[80%] p-5 overflow-y-auto h-full'>
        <div className="p-2 bg-muted">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <Button onClick={handleAddUser} className="bg-black text-xl text-white">Add User</Button>
          </div>
          <div className="bg-background rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center gap-4">
                <Input
                  type="search"
                  placeholder="Search users..."
                  value={filterText}
                  onChange={handleFilterChange}
                  className="flex-1"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Sort by <ChevronDownIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuRadioGroup value={sortColumn} onValueChange={handleSortColumn}>
                      <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="email">Email</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="role">Role</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {Array.isArray(user.role) ? user.role.join(', ') : user.role}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Active" ? "success" : "danger"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user)} className="bg-black text-white">
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivateUser(user)}
                        className={`ml-2 ${user.status === "Active" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
                      >
                        {user.status === "Active" ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {sortedUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle>{isAddingUser ? "Add User" : "Edit User"}</DialogTitle>
                <DialogDescription>
                  {isAddingUser ? "Fill in the user details" : "Update the user details"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                {isAddingUser && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <div className="col-span-3">
                    {["Student", "Faculty", "Internship Coordinator", "Super Admin"].map((role) => (
                      <div key={role} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={role}
                          checked={newUser.role.includes(role)}
                          onChange={() => toggleRole(role)}
                        />
                        <label htmlFor={role}>{role}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {isAddingUser && newUser.role.includes("Student") && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Select
                      id="department"
                      value={newUser.department || ""}
                      className="col-span-3"
                      onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {departmentOptions.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {!isAddingUser && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      id="status"
                      value={newUser.status}
                      className="col-span-3"
                      onValueChange={(value) => setNewUser({ ...newUser, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button onClick={handleSaveUser}>{isAddingUser ? "Add User" : "Save Changes"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export default ManageUsers
