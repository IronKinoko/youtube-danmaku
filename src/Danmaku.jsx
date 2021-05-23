import React, { useEffect, useState } from "react";
import {
  Box,
  ClickAwayListener,
  Divider,
  Fade,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Slider,
  createMuiTheme,
  createStyles,
  makeStyles,
  ThemeProvider as MuiThemeProvider,
  Switch,
  Tooltip,
} from "@material-ui/core";

import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import DeleteIcon from "@material-ui/icons/Delete";
import { observer } from "mobx-react";
import { config } from "./configStore";
const muiTheme = createMuiTheme({
  palette: {
    secondary: { main: "#f00" },
  },
  overrides: {
    MuiSwitch: {
      thumb: { backgroundColor: "white" },
      track: { opacity: "1 !important" },
    },
  },
});

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: "relative",
    },
    controls: {
      backgroundColor: "rgba(28,28,28,0.9)",
      position: "absolute",
      bottom: 40,
      color: "white",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: theme.zIndex.tooltip,
      width: 300,
    },
    sliderRoot: {
      display: "flex",
      alignItems: "center",
    },
    slider: {
      margin: theme.spacing(0, 1, 0, 2),
      flex: 1,
    },
    tooltip: {
      padding: theme.spacing(0.5, 1),
      backgroundColor: "rgba(28,28,28,0.9)",
      fontSize: 13,
      borderRadius: 2,
      fontWeight: 400,
    },
    listButton: {
      "&:hover": {
        backgroundColor: "rgba(255,255,255,.1)",
      },
    },
    scrollPanelContainer: {
      width: 300,
      overflow: "hidden",
      transition: theme.transitions.create("height"),
    },
    scrollPanel: {
      display: "flex",
      transition: theme.transitions.create("transform"),
      "&>*": {
        width: 300,
        flexShrink: 0,
      },
    },
  })
);

const Danmaku = observer(() => {
  const [open, setOpen] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const classes = useStyles();

  const handleUse = () => {
    config.toggleDanmaku(!config.use);
  };

  const handleFilterUse = () => {
    config.toggleFilterUse(!config.filterUse);
  };

  const handleShowSticker = () => {
    config.toggleShowSticker(!config.showStickers);
  };

  const handleShowSuperChat = () => {
    config.toggleShowSuperChat(!config.showSuperChat);
  };

  useEffect(() => {
    if (open === false) setPageKey(0);
  }, [open]);

  const height = pageKey === 0 ? 288 : 400;

  return (
    <MuiThemeProvider theme={muiTheme}>
      <span className={classes.root}>
        <Tooltip
          title="弹幕"
          placement="top"
          classes={{ tooltip: classes.tooltip }}
        >
          <button
            style={{ textAlign: "center" }}
            onClick={() => setOpen(true)}
            className="ytp-button"
          >
            弹幕
          </button>
        </Tooltip>

        <Fade in={open} unmountOnExit>
          <Box className={classes.controls}>
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <div className={classes.scrollPanelContainer} style={{ height }}>
                <div
                  className={classes.scrollPanel}
                  style={{ transform: `translateX(-${pageKey * 300}px)` }}
                >
                  <List>
                    <ListItem
                      button
                      className={classes.listButton}
                      onClick={handleUse}
                    >
                      <ListItemText
                        primary="弹幕开关"
                        primaryTypographyProps={{
                          className: "ytp-menuitem-label",
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
                          className: "ytp-menuitem-label",
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
                    <ListItem
                      button
                      className={classes.listButton}
                      onClick={handleShowSuperChat}
                    >
                      <ListItemText
                        primary="显示Super Chat"
                        primaryTypographyProps={{
                          className: "ytp-menuitem-label",
                          style: { fontWeight: 500 },
                        }}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={config.showSuperChat}
                          onClick={handleShowSuperChat}
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
                                config.changeDanmakuSpeed(v);
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
                                config.changeDanmakuOpacity(v);
                              }}
                            />
                          </div>
                        }
                      />
                    </ListItem>
                    <ListItem
                      className={classes.listButton}
                      button
                      onClick={() => {
                        setPageKey(1);
                      }}
                    >
                      <ListItemText primary="弹幕屏蔽" />
                      <ListItemSecondaryAction>
                        <ArrowForwardIos />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                  <div>
                    <List>
                      <ListItem
                        className={classes.listButton}
                        button
                        onClick={() => {
                          setPageKey(0);
                        }}
                      >
                        <ArrowBackIos color="inherit" />
                        <ListItemText primary="弹幕屏蔽" />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={config.filterUse}
                            onClick={handleFilterUse}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider style={{ backgroundColor: "#444" }} />
                    </List>
                    <Fade in={config.filterUse} unmountOnExit>
                      <FilterDanmaku />
                    </Fade>
                  </div>
                </div>
              </div>
            </ClickAwayListener>
          </Box>
        </Fade>
      </span>
    </MuiThemeProvider>
  );
});

const useFilterStyles = makeStyles((theme) =>
  createStyles({
    root: {
      textAlign: "left",
      padding: theme.spacing(1, 2),
    },
    inputContainer: {
      display: "flex",
    },
    input: {
      border: "1px solid rgba(255,255,255,.4)",
      borderRadius: 2,
      flex: 1,
    },
    addbtn: {
      border: "1px solid rgba(255,255,255,.4)",
      borderRadius: 2,
      marginLeft: 8,
      backgroundColor: "transparent",
      padding: theme.spacing(0, 1),
      color: "white",
    },
    table: {
      fontSize: 12,
      marginTop: theme.spacing(1),
    },
    thead: {
      marginBottom: theme.spacing(0.5),
    },
    row: {
      display: "flex",
      padding: theme.spacing(0.25, 0),
    },
    op: {
      flex: 1,
      display: "flex",
      justifyContent: "space-between",
      "& > :last-child": {
        marginLeft: theme.spacing(1),
      },
      "& > div": {
        cursor: "pointer",
      },
    },
    delete: {
      marginRight: 4,
    },
    content: {
      width: "100%",
      maxWidth: 200,
      paddingRight: theme.spacing(1),
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    list: {
      overflow: "auto",
      height: 260,
      "&::-webkit-scrollbar": {
        width: 0,
      },
    },
  })
);
const FilterDanmaku = observer(({ style }) => {
  const classes = useFilterStyles();
  const [state, setState] = useState("");

  const handleAdd = () => {
    config.addFilter(state);
    setState("");
  };

  return (
    <div className={classes.root} style={style}>
      <div className={classes.inputContainer}>
        <input
          placeholder="屏蔽内容..."
          className={classes.input}
          value={state}
          onChange={(e) => setState(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAdd();
            }
          }}
        />
        <button className={classes.addbtn} onClick={handleAdd}>
          添加
        </button>
      </div>
      <div className={classes.table}>
        <div className={`${classes.row} ${classes.thead}`}>
          <div className={classes.content}>
            内容( {config.filterList.length} )
          </div>
          <div className={classes.op}>
            <div>状态</div>
            <div>操作</div>
          </div>
        </div>
        <div className={classes.list}>
          {config.filterList.map((o) => (
            <div className={classes.row} key={o.id}>
              <div className={classes.content}>{o.content}</div>
              <div className={classes.op}>
                <div onClick={() => config.changeFilterUse(o.id)}>
                  {o.isuse ? "启用" : "禁用"}
                </div>
                <div
                  className={classes.delete}
                  onClick={() => {
                    config.deleteFilter(o.id);
                  }}
                >
                  <DeleteIcon style={{ fontSize: 16 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
export default Danmaku;
