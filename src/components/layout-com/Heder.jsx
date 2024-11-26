import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import Distance from "../../pages/Distance";
import { Modal } from "@mui/material";

const pages = [
  { name: "נסיעות", path: "/orders" },
  { name: "לקוחות", path: "/customers" },
  { name: "ספקים", path: "/bus-company" },
  { name: "הזמנה חדשה", path: "/orders/new" },
  { name: "דוחות", path: "/reports" },
];
const settings = [
  { name: "פרופיל", action: "profile" },
  { name: "הגדרות חשבון", action: "settings" },
  { name: "התנתקות", action: "logout" }
];

function Heder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [userPhoto, setUserPhoto] = React.useState("");

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name || user.email.split('@')[0]);
      setUserPhoto(user.photoURL || ""); // Set user photo URL if available
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        // Handle sign out for both Firebase and Google auth
        await signOut(auth);
        
        // If user was signed in with Google, you might want to handle additional cleanup
        if (user.providerData.some(provider => provider.providerId === 'google.com')) {
          // Optional: Add any Google-specific cleanup here if needed
          console.log('Google user signed out successfully');
        }
      }
      
      // Clear all localStorage
      localStorage.clear();
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
      // You might want to show an error message to the user here
    }
  };

  const handleSettingsAction = (action) => {
    handleCloseUserMenu();
    switch (action) {
      case 'logout':
        handleLogout();
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "primary.dark" }}> {/* Change AppBar color */}
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <DirectionsBusIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={handleLogoClick}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Bederech-hyshar
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => handleNavigation(page.path)}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={() => setOpen(true)}>
                <Typography sx={{ textAlign: "center" }}>חישוב מרחקים</Typography>
                </MenuItem>
            </Menu>
          </Box>
          <DirectionsBusIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={handleLogoClick}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Bederech-hyshar
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavigation(page.path)}
                sx={{ 
                  my: 2, 
                  color: location.pathname === page.path ? "secondary.main" : "white", // Adjust highlight color
                  display: "block" 
                }}
              >
                {page.name}
              </Button>
            ))}
            <Button
              color={location.pathname === "/distance" ? "secondary.main" : "inherit"} // Adjust highlight color
              onClick={() => setOpen(true)}
              sx={{ my: 2 }}
            >
              חישוב מרחקים
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 2 }}>{userName}</Typography>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userName} src={userPhoto} /> {/* Set avatar src */}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem 
                  key={setting.name} 
                  onClick={() => handleSettingsAction(setting.action)}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <Modal
        open={open}
        onClose={handleClose} // Changed from onCancel to onClose
        footer={[
          <Button key="close" onClick={handleClose}>
            סגור
          </Button>,
        ]}
        width="90%"
      >
        <Box>
          <Distance />
        </Box>
      </Modal>
    </AppBar>
  );
}
export default Heder;
