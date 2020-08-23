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
import makeStyles from '@material-ui/core/styles/makeStyles'
import createStyles from '@material-ui/core/styles/createStyles'
import Slider from '@material-ui/core/Slider'
import { changeDanmakuSpeed, changeDanmakuOpacity, toggleDanmaku } from './CM'
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
  })
)
const Danmaku = () => {
  const [open, setOpen] = useState(false)
  const classes = useStyles()
  const [config, setConfig] = useLocalStorageState('ytb-danmaku-config', {
    scale: 1.5,
    opacity: 0.7,
    use: false,
  })

  useEffect(() => {
    toggleDanmaku(config.use)
    changeDanmakuSpeed(config.scale)
    changeDanmakuOpacity(config.opacity)
  }, [])

  const handleSwitch = () => {
    setConfig((t) => {
      toggleDanmaku(!t.use)
      return { ...t, use: !t.use }
    })
  }

  return (
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
                onClick={handleSwitch}
              >
                <ListItemText
                  primary="弹幕开关"
                  primaryTypographyProps={{
                    className: 'ytp-menuitem-label',
                    style: { fontWeight: 500 },
                  }}
                />
                <ListItemSecondaryAction>
                  <Switch checked={config.use} onClick={handleSwitch} />
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
                          setConfig((t) => ({ ...t, scale: v }))
                          changeDanmakuSpeed(v)
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
                          setConfig((t) => ({ ...t, opacity: v }))
                          changeDanmakuOpacity(v)
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
  )
}

export default Danmaku

/**
 * @param {string} key
 * @param {any} defaultValue
 */
function useLocalStorageState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    let res = localStorage.getItem(key)
    if (res !== null) {
      try {
        return JSON.parse(res)
      } catch (error) {}
    }
    return defaultValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue]
}
