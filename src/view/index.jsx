import {
  Box,
  ClickAwayListener,
  createMuiTheme,
  createStyles,
  Fade,
  makeStyles,
  ThemeProvider as MuiThemeProvider,
  Tooltip,
  useTheme,
} from '@material-ui/core'
import { observer } from 'mobx-react'
import React, { useState, useRef, useEffect } from 'react'
import { useCallback } from 'react'
import { getPanelSize } from '../utils'
import BaseConfig from './BaseConfig'
import FilterDanmaku from './FilterDanmaku'

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

    tooltip: {
      padding: theme.spacing(0.5, 1),
      backgroundColor: 'rgba(28,28,28,0.9)',
      fontSize: 13,
      borderRadius: 2,
      fontWeight: 400,
    },

    container: {
      width: 300,
      '&>div': {
        width: 300,
        display: 'flex',
        overflow: 'hidden',
        transition: theme.transitions.create(['height']),
        '&>*': {
          flexShrink: 0,
          width: 300,
        },
      },
    },
  })
)

const Danmaku = () => {
  const [open, setOpen] = useState(false)
  const classes = useStyles()
  const containerRef = useRef()
  const theme = useTheme()
  useEffect(() => {
    if (open) {
      Array.from(containerRef.current.children).forEach(
        (o, i) => (o.hidden = i !== 0)
      )
    }
  }, [open])

  const switchPanel = useCallback((key, isBack) => {
    const target = document.getElementById(`k-${key}`)

    const current = Array.from(containerRef.current.children).find(
      (o) => !o.hidden
    )

    const currentSize = current.getBoundingClientRect()
    containerRef.current.style.height = `${currentSize.height}px`

    const restore = (e) => {
      if (
        e.target !== containerRef.current &&
        !['height'].includes(e.propertyName)
      )
        return

      containerRef.current.style.height = ''
      ;[current, target].forEach((o) => {
        o.style.transform = ''
        o.style.transition = ''
      })
      current.hidden = true
      containerRef.current.removeEventListener('transitionend', restore)
    }

    containerRef.current.addEventListener('transitionend', restore)

    const size = getPanelSize(target)
    containerRef.current.style.height = `${size.height}px`

    target.hidden = false
    Array.from(containerRef.current.children).forEach((o) => {
      o.style.transform = `translateX(${isBack ? '-300' : '0'}px)`
      requestAnimationFrame(() => {
        o.style.transform = `translateX(${isBack ? '0' : '-300'}px)`
        o.style.transition = theme.transitions.create(['transform'])
      })
    })
  }, [])
  return (
    <MuiThemeProvider theme={muiTheme}>
      <style jsx>{`
        [hidden] {
          display: none !important;
        }
      `}</style>
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
              <div className={classes.container}>
                <div ref={containerRef}>
                  <BaseConfig switchPanel={switchPanel} />
                  <FilterDanmaku switchPanel={switchPanel} />
                </div>
              </div>
            </ClickAwayListener>
          </Box>
        </Fade>
      </span>
    </MuiThemeProvider>
  )
}

export default observer(Danmaku)
