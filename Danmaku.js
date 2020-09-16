import React, { useState, useEffect } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Switch from '@material-ui/core/Switch'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Box from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'
import Slider from '@material-ui/core/Slider'
import {
  ThemeProvider as MuiThemeProvider,
  makeStyles,
  createStyles,
  createMuiTheme,
} from '@material-ui/core/styles'
import { config } from './configStore'
import { observer } from 'mobx-react'

const muiTheme = createMuiTheme({
  palette: {
    secondary: { main: '#f00' },
  },
  overrides: {
    MuiSwitch: {
      thumb: { backgroundColor: 'white' },
      track: { opacity: '1 !important' },
    },
  },
})

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: 'relative',
    },
    controls: {
      backgroundColor: 'rgba(28,28,28,0.9)',
      position: 'absolute',
      bottom: 40,
      color: 'white',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: theme.zIndex.tooltip,
      width: 300,
    },
    sliderRoot: {
      display: 'flex',
      alignItems: 'center',
    },
    slider: {
      margin: theme.spacing(0, 1, 0, 2),
      flex: 1,
    },
    tooltip: {
      padding: theme.spacing(0.5, 1),
      backgroundColor: 'rgba(28,28,28,0.9)',
      fontSize: 13,
      borderRadius: 2,
      fontWeight: 400,
    },
    listButton: {
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,.1)',
      },
    },
    switch: {},
  })
)

const Danmaku = observer(() => {
  const [open, setOpen] = useState(false)
  const classes = useStyles()

  const handleUse = () => {
    config.toggleDanmaku(!config.use)
  }

  const handleShowSticker = () => {
    config.toggleShowSticker(!config.showStickers)
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <span className={classes.root}>
        <Tooltip
          title="弹幕"
          placement="top"
          classes={{ tooltip: classes.tooltip }}
        >
          <button
            style={{ textAlign: 'center' }}
            onClick={() => setOpen(true)}
            className="ytp-button"
          >
            弹幕
          </button>
        </Tooltip>

        <Fade in={open} unmountOnExit>
          <Box className={classes.controls}>
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <List>
                <ListItem
                  button
                  className={classes.listButton}
                  onClick={handleUse}
                >
                  <ListItemText
                    primary="弹幕开关"
                    primaryTypographyProps={{
                      className: 'ytp-menuitem-label',
                      style: { fontWeight: 500 },
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch checked={config.use} onClick={handleUse} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem
                  button
                  className={classes.listButton}
                  onClick={handleShowSticker}
                >
                  <ListItemText
                    primary="显示贴纸"
                    primaryTypographyProps={{
                      className: 'ytp-menuitem-label',
                      style: { fontWeight: 500 },
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={config.showStickers}
                      onClick={handleShowSticker}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem className={classes.listButton}>
                  <ListItemText
                    primary={
                      <div className={classes.sliderRoot}>
                        <div className="ytp-menuitem-label">弹幕速度</div>
                        <Slider
                          color="secondary"
                          max={2}
                          step={0.1}
                          min={0.1}
                          value={config.scale}
                          valueLabelDisplay="auto"
                          className={classes.slider}
                          onChange={(e, v) => {
                            config.changeDanmakuSpeed(v)
                          }}
                        />
                      </div>
                    }
                  />
                </ListItem>
                <ListItem className={classes.listButton}>
                  <ListItemText
                    primary={
                      <div className={classes.sliderRoot}>
                        <div className="ytp-menuitem-label">不透明度</div>
                        <Slider
                          color="secondary"
                          max={1}
                          step={0.1}
                          min={0}
                          value={config.opacity}
                          valueLabelDisplay="auto"
                          className={classes.slider}
                          onChange={(e, v) => {
                            config.changeDanmakuOpacity(v)
                          }}
                        />
                      </div>
                    }
                  />
                </ListItem>
              </List>
            </ClickAwayListener>
          </Box>
        </Fade>
      </span>
    </MuiThemeProvider>
  )
})

export default Danmaku
