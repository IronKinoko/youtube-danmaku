import {
  createStyles,
  Divider,
  Fade,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Switch,
} from '@material-ui/core'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import DeleteIcon from '@material-ui/icons/Delete'
import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { config } from '../configStore'

const useFilterStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      height: 350,
    },
    filterRoot: {
      flex: 1,
      overflow: 'hidden',
      textAlign: 'left',
      padding: theme.spacing(1, 2),
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    },
    inputContainer: {
      display: 'flex',
    },
    input: {
      padding: theme.spacing(0.25, 1),
      border: '1px solid rgba(255,255,255,.4)',
      borderRadius: 2,
      flex: 1,
      '&:focus': {
        outline: 0,
      },
    },
    addBtn: {
      border: '1px solid rgba(255,255,255,.4)',
      borderRadius: 2,
      marginLeft: 8,
      backgroundColor: 'transparent',
      padding: theme.spacing(0.25, 1),
      color: 'white',
    },
    listButton: {
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,.1)',
      },
    },
    cell: {
      padding: theme.spacing(0.25, 0),
      lineHeight: 1.2,
      '& + &': {
        paddingLeft: theme.spacing(1),
      },
    },
    contentCell: {
      width: 180,
      wordBreak: 'break-all',
    },
    op: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '& > * + *': {
        marginLeft: theme.spacing(1),
      },
    },
  })
)

const FilterDanmaku = ({ switchPanel }) => {
  const classes = useFilterStyles()
  const [state, setState] = useState('')
  const [t] = useTranslation()

  const handleAdd = () => {
    config.addFilter(state)
    setState('')
  }

  const handleFilterUse = () => {
    config.toggleFilterUse(!config.filterUse)
  }

  return (
    <div id="k-filter" className={classes.root}>
      <List>
        <ListItem
          className={classes.listButton}
          button
          onClick={() => switchPanel('base', true)}
        >
          <ArrowBackIos color="inherit" />
          <ListItemText primary={t('filter.label')} />
          <ListItemSecondaryAction>
            <Switch checked={config.filterUse} onClick={handleFilterUse} />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider style={{ backgroundColor: '#444' }} />
      </List>
      <Fade in={config.filterUse} unmountOnExit>
        <div className={classes.filterRoot}>
          <div className={classes.inputContainer}>
            <input
              placeholder={t('filter.enterContent')}
              className={classes.input}
              value={state}
              onChange={(e) => {
                setState(e.target.value)
              }}
              onKeyDownCapture={(e) => {
                if (e.key === 'Enter') {
                  handleAdd()
                }
              }}
            />
            <button className={classes.addBtn} onClick={handleAdd}>
              {t('filter.add')}
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th className={classes.cell}>
                  {t('filter.content')}({config.filterList.length})
                </th>
                <th className={classes.cell} align="right">
                  {t('filter.operation')}
                </th>
              </tr>
            </thead>
            <tbody>
              {config.filterList.map((o) => (
                <tr key={o.id}>
                  <td className={`${classes.contentCell} ${classes.cell}`}>
                    {o.content}
                  </td>
                  <td className={classes.cell} align="right">
                    <div className={classes.op}>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => config.changeFilterUse(o.id)}
                      >
                        {o.isuse ? t('filter.on') : t('filter.off')}
                      </span>
                      <span
                        style={{
                          fontSize: '1em',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          config.deleteFilter(o.id)
                        }}
                      >
                        <DeleteIcon />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fade>
    </div>
  )
}
export default observer(FilterDanmaku)
