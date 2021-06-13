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
} from "@material-ui/core";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import DeleteIcon from "@material-ui/icons/Delete";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { config } from "../configStore";

const useFilterStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      height: 350,
    },
    filterRoot: {
      flex: 1,
      overflow: "hidden",
      textAlign: "left",
      padding: theme.spacing(1, 2),
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    },
    inputContainer: {
      display: "flex",
    },
    input: {
      padding: theme.spacing(0.25, 1),
      border: "1px solid rgba(255,255,255,.4)",
      borderRadius: 2,
      flex: 1,
      "&:focus": {
        outline: 0,
      },
    },
    addbtn: {
      border: "1px solid rgba(255,255,255,.4)",
      borderRadius: 2,
      marginLeft: 8,
      backgroundColor: "transparent",
      padding: theme.spacing(0.25, 1),
      color: "white",
    },
    table: {
      fontSize: 12,
      marginTop: theme.spacing(1),
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
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
    listContainer: { flex: 1, overflow: "hidden" },
    list: {
      height: "100%",
      overflow: "auto",
      "&::-webkit-scrollbar": {
        width: 0,
      },
    },
    sliderRoot: {
      display: "flex",
      alignItems: "center",
    },
    slider: {
      margin: theme.spacing(0, 1, 0, 2),
      flex: 1,
    },
    listButton: {
      "&:hover": {
        backgroundColor: "rgba(255,255,255,.1)",
      },
    },
  })
);

const FilterDanmaku = ({ switchPanel }) => {
  const classes = useFilterStyles();
  const [state, setState] = useState("");

  const handleAdd = () => {
    config.addFilter(state);
    setState("");
  };

  const handleFilterUse = () => {
    config.toggleFilterUse(!config.filterUse);
  };

  return (
    <div id="k-filter" className={classes.root}>
      <List>
        <ListItem
          className={classes.listButton}
          button
          onClick={() => switchPanel("base", true)}
        >
          <ArrowBackIos color="inherit" />
          <ListItemText primary="弹幕屏蔽" />
          <ListItemSecondaryAction>
            <Switch checked={config.filterUse} onClick={handleFilterUse} />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider style={{ backgroundColor: "#444" }} />
      </List>
      <Fade in={config.filterUse} unmountOnExit>
        <div className={classes.filterRoot}>
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
            <div className={classes.listContainer}>
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
        </div>
      </Fade>
    </div>
  );
};
export default observer(FilterDanmaku);
