import {
  createStyles,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Slider,
  Switch,
} from "@material-ui/core";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import { observer } from "mobx-react";
import React from "react";
import { config } from "../configStore";

const useStyles = makeStyles((theme) =>
  createStyles({
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

const BaseConfig = ({ switchPanel }) => {
  const classes = useStyles();

  const handleUse = () => {
    config.toggleDanmaku(!config.use);
  };

  const handleShowSticker = () => {
    config.toggleShowSticker(!config.showStickers);
  };

  const handleShowSuperChat = () => {
    config.toggleShowSuperChat(!config.showSuperChat);
  };
  return (
    <List id="k-base">
      <ListItem button className={classes.listButton} onClick={handleUse}>
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
          <Switch checked={config.showStickers} onClick={handleShowSticker} />
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
        onClick={() => switchPanel("filter")}
      >
        <ListItemText primary="弹幕屏蔽" />
        <ListItemSecondaryAction>
          <ArrowForwardIos />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default observer(BaseConfig);
