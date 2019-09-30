import React, { Component } from "react";
import Header from "./Header";
import Head from "next/head";
import { Segment } from "semantic-ui-react";
import { Router } from "../routes";
import web3 from "../ethereum/web3";
import Particles from "react-particles-js";
class Layout extends Component {
  async componentDidMount() {
    if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
      web3.eth.getAccounts(function(err, accounts) {
        if (err != null) console.error("An error occurred: " + err);
        else if (accounts.length == 0) Router.push("/metamask");
        else console.log("User is logged in to MetaMask");
      });
    } else {
      console.log("no metamask");
      Router.push("/metamask");
    }
  }
  render() {
    return (
      <div style={{ background: "black", height: "100%" }}>
        <Segment
          style={{
            position: "absolute",
            zIndex: "1",
            marginLeft: "12vw",
            marginTop: "10vw",
            width: "76vw"
          }}>
          <Head>
            <link
              rel='stylesheet'
              href='//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css'
            />
          </Head>

          <Header />
          {this.props.children}
        </Segment>

        <Particles
          params={{
            particles: {
              number: {
                value: 100,
                density: {
                  enable: true,
                  value_area: 800
                }
              },
              color: {
                value: "#eeeeee"
              },
              shape: {
                type: "circle",
                stroke: {
                  width: 0,
                  color: "#000000"
                }
              },
              opacity: {
                value: 0.4,
                random: true,
                anim: {
                  enable: true,
                  speed: 1,
                  opacity_min: 0.1,
                  sync: false
                }
              },
              size: {
                value: 3,
                random: true,
                anim: {
                  enable: true,
                  speed: 2,
                  size_min: 0.1,
                  sync: false
                }
              },
              line_linked: {
                enable_auto: true,
                distance: 100,
                color: "#fff",
                opacity: 1,
                width: 1,
                condensed_mode: {
                  enable: false,
                  rotateX: 600,
                  rotateY: 600
                }
              },
              move: {
                enable: true,
                speed: 3,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: true,
                attract: {
                  enable: false,
                  rotateX: 600,
                  rotateY: 1200
                }
              }
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onhover: {
                  enable: true
                },
                onclick: {
                  enable: true
                },
                resize: true
              }
            },
            retina_detect: true
          }}
        />
      </div>
    );
  }
}

export default Layout;
