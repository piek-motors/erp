// import { PaletteOptions, ThemeOptions } from '@mui/material'

// const pallete = (preferTheme: string): PaletteOptions => ({
//   ...(preferTheme === 'light'
//     ? {
//       // palette values for light preferTheme
//       mode: 'light',
//       primary: {
//         main: '#4361e4',
//         light: '#E7E9FB'
//       },
//       secondary: {
//         main: '#e5534b'
//       }
//     }
//     : {
//       // palette values for dark preferTheme
//       mode: 'dark',
//       primary: {
//         main: '#99affc',
//         light: '#43435c'
//       },
//       secondary: {
//         main: '#e5534b'
//       }
//     })
// })

// export const customizedTheme = (preferTheme: string): ThemeOptions => ({
//   palette: pallete(preferTheme),
//   typography: {
//     fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif`,
//     subtitle1: {
//       // Акцентный подзаголовок
//       fontSize: '.8rem',
//       textTransform: 'uppercase',
//       fontWeight: 600,
//       letterSpacing: '.5px',
//       color: 'var(--accent) !important'
//     },
//     subtitle2: {
//       // Нейтральный подзаголовок
//       fontWeight: 600,
//       textTransform: 'uppercase',
//       fontSize: '.8rem'
//     },
//   },
//   components: {

//     MuiMenuItem: {
//       defaultProps: {
//         disableRipple: true
//       }
//     },
//     MuiListItemText: {
//       styleOverrides: {
//         primary: {
//           fontSize: '.9rem'
//         }
//       }
//     },
//     MuiListItemIcon: {
//       styleOverrides: {
//         root: {
//           minWidth: '25px !important',
//           svg: {
//             width: '17px'
//           }
//         }
//       }
//     },
//     MuiButton: {
//       variants: [
//         {
//           props: {
//           },
//           style: {
//             minWidth: '10px',
//             minHeight: '10px',
//             padding: '8px',
//             margin: '2px',
//             borderRadius: '8px',
//             svg: {
//               width: 20
//             },
//             '&.active': {
//               background: 'var(--accentLight)',
//               color: 'var(--accent)'
//             }
//           }
//         }
//       ],
//       styleOverrides: {
//         root: {
//           transitionDuration: '0ms',
//           textTransform: 'none',
//           borderRadius: '10px'
//         },
//         textInfo: {
//           color: 'var(--lowContrast) !important'
//         }
//       },
//       defaultProps: {
//         disableElevation: true,
//         disableRipple: true
//       }
//     },
//     MuiToggleButton: {
//       defaultProps: {
//         disableRipple: true,
//       },
//       styleOverrides: {
//         root: {
//           margin: "3px 0",
//           textTransform: 'none',
//           borderRadius: 12
//         }
//       }
//     },
//     MuiTextField: {
//       defaultProps: {
//         variant: 'filled',
//         autoComplete: 'off'
//       }
//     },
//     MuiAutocomplete: {
//       styleOverrides: {
//         root: {
//           borderRadius: 'var(--br) !important'
//         },
//         paper: {
//           border: 'var(--border)',
//           boxShadow: 'none !important'
//         }
//       }
//     },
//     MuiInputLabel: {
//       styleOverrides: {
//         root: {
//           color: 'var(--lowContrast) !important'
//         }
//         // filter: {
//         //   fontSize: '.8rem',
//         //   transform: 'none',
//         //   position: 'relative'
//         // }
//       },
//       defaultProps: {
//         shrink: true
//       }
//     },
//     MuiFilledInput: {
//       defaultProps: {
//         disableUnderline: true,
//         size: 'small'
//       },
//       styleOverrides: {
//         root: {
//           background: 'var(--L0)',
//           border: '1px solid var(--L2)',
//           borderRadius: '10px',
//           margin: '4px 0'
//         }
//       }
//     },
//     MuiInput: {
//       defaultProps: {
//         disableUnderline: true
//       }
//     },
//     MuiInputBase: {
//       styleOverrides: {
//         root: {
//           color: 'var(--highContrast) !important'
//         }
//       }
//     },
//     MuiOutlinedInput: {
//       styleOverrides: {
//         notchedOutline: {
//           border: 'none'
//         }
//       }
//     },
//     MuiPopover: {
//       styleOverrides: {
//         paper: {
//           border: 'var(--border)',
//           background: 'var(--L2)',
//           borderRadius: 'var(--br) !important'
//         }
//       }
//     },
//     MuiFormControl: {
//       defaultProps: {
//         variant: 'filled'
//       }
//     },
//     MuiSelect: {
//       styleOverrides: {
//         select: {
//           // boxShadow: 'none !important'
//         }
//       },
//       defaultProps: {
//         variant: 'filled',
//         size: 'small'
//       }
//     },

//     MuiCheckbox: {
//       defaultProps: {
//         disableRipple: true,
//         color: 'primary',
//         size: 'small'
//       }
//     },
//     MuiTab: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//         },
//       }
//     },
//     MuiToggleButtonGroup: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none'
//         },
//       }
//     },

//   }
// })
