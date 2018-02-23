var CommonAnimationBase = function (lib, img, cjs, txt) {

    var p; // shortcut to reference prototypes
    var loadedTypekitCount = 0;
    var loadedGoogleCount = 0;
    var gFontsUpdateCacheList = [];
    var tFontsUpdateCacheList = [];

    lib.webFontTxtInst = {};
    lib.ssMetadata = [];
    lib.txt = txt;

    lib.updateListCache = function (cacheList) {
        for (var i = 0; i < cacheList.length; i++) {
            if (cacheList[i].cacheCanvas)
                cacheList[i].updateCache();
        }
    };

    lib.addElementsToCache = function (textInst, cacheList) {
        var cur = textInst;
        while (cur != exportRoot) {
            if (cacheList.indexOf(cur) != -1)
                break;
            cur = cur.parent;
        }
        if (cur != exportRoot) {
            var cur2 = textInst;
            var index = cacheList.indexOf(cur);
            while (cur2 != cur) {
                cacheList.splice(index, 0, cur2);
                cur2 = cur2.parent;
                index++;
            }
        }
        else {
            cur = textInst;
            while (cur != exportRoot) {
                cacheList.push(cur);
                cur = cur.parent;
            }
        }
    };

    lib.gfontAvailable = function (family, totalGoogleCount) {
        lib.properties.webfonts[family] = true;
        var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];
        for (var f = 0; f < txtInst.length; ++f)
            lib.addElementsToCache(txtInst[f], gFontsUpdateCacheList);

        loadedGoogleCount++;
        if (loadedGoogleCount == totalGoogleCount) {
            lib.updateListCache(gFontsUpdateCacheList);
        }
    };

    lib.tfontAvailable = function (family, totalTypekitCount) {
        lib.properties.webfonts[family] = true;
        var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];
        for (var f = 0; f < txtInst.length; ++f)
            lib.addElementsToCache(txtInst[f], tFontsUpdateCacheList);

        loadedTypekitCount++;
        if (loadedTypekitCount == totalTypekitCount) {
            lib.updateListCache(tFontsUpdateCacheList);
        }
    };

    this.mc_symbol_clone = function () {
        var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
        clone.gotoAndStop(this.currentFrame);
        clone.paused = this.paused;
        clone.framerate = this.framerate;
        return clone;
    }

    this.getMCSymbolPrototype = function (symbol, nominalBounds, frameBounds) {
        var prototype = cjs.extend(symbol, cjs.MovieClip);
        prototype.clone = this.mc_symbol_clone;
        prototype.nominalBounds = nominalBounds;
        prototype.frameBounds = frameBounds;
        return prototype;
    }

    lib.initializeFrameHandler = this.initializeFrameHandler = function (stage) {

        if (this.frameHandler) return;

        //console.log('init handler');

        // timeline functions:
        this.frameHandler = function () {

            this.gotoAndStop(1);
            
            this.addEventListener("play", playAnimation.bind(this));
            this.addEventListener("playReverse", playReverse.bind(this));

            function playF(e) {
                this.gotoAndStop(this.currentFrame + 1);
                //console.log(this.totalFrames);
                //console.log(this.currentFrame);
                if (this.currentFrame == this.totalFrames - 1) {
                    if (!this.skipFreezingOfAnimation) {
                        cjs.Ticker.removeAllEventListeners();
                    }
                    cjs.dispatchEvent(new CustomEvent('changeState', { detail: "playedForward" }));
                }
                if (this.stage) {
                    this.stage.update();
                }
            }

            function playAnimation() {
                //console.log('play animation forward');
                if (cjs.Ticker.hasEventListener('tick')) {
                    cjs.Ticker.removeAllEventListeners();
                }
                cjs.Ticker.addEventListener("tick", playF.bind(this));
            }

            function rewindF(e) {
                this.gotoAndStop((this.currentFrame - 1));
                if (this.currentFrame == 0) {
                    cjs.Ticker.removeAllEventListeners();
                    cjs.dispatchEvent(new CustomEvent('changeState', { detail: "playedBackward" }));
                } else {
                    if (this.stage) {
                        this.stage.update();
                    }
                }
            }

            function playReverse() {
                //console.log('play animation backwards');
                if (cjs.Ticker.hasEventListener('tick')) {
                    cjs.Ticker.removeAllEventListeners();
                }
                cjs.Ticker.addEventListener("tick", rewindF.bind(this));
            }
        };

        stage.timeline.addTween(cjs.Tween.get(stage).call(this.frameHandler));
    }

    this.in = function (animator, text) {
        console.error('Base animation is missing. Override this method in child class to show enter animation here.');
    }

    this.out = function (animator, text) {
        console.error('Base animation is missing. Override this method in child class to show leave animation here.');
    }
};

// Common event with white stripe + medkit icon
var CommonAnimation_FirstAid = function (lib, img, cjs, txt) {

    CommonAnimationBase.call(this, lib, img, cjs, txt);

    (lib.firstAidImg = function () {
        this.initialize(img.first_aid);
    }).prototype = p = new cjs.Bitmap();
    p.nominalBounds = new cjs.Rectangle(0, 0, 600, 600);// helper functions:

    (lib.firstAid_MC = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Layer 2
        this.instance = new lib.firstAidImg();
        this.instance.parent = this;
        this.instance.setTransform(-8, 7, 0.15, 0.15);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

        // Layer 1
        this.shape = new cjs.Shape();
        this.shape.graphics.rf(["#666666", "rgba(102,102,102,0)"], [0, 0.957], -9.9, -2.7, 0, -9.9, -2.7, 41.3).s().p("ACoBaQhTgJhkgXQhHgWg4gWIgwgTQhugwAGgZQAEgNAfgCQAggEA8AHIAzAHIANACQA4AKA/AOQBjAeBMAgQBvAxgHAZQgEAQg1AAQgcAAgqgFg");
        this.shape.setTransform(31.2, 80.7);

        this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

    }).prototype = this.getMCSymbolPrototype(lib.firstAid_MC, new cjs.Rectangle(-8, 7, 90.2, 90.2), null);


    // stage content:
    (lib.getExportRoot = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, { "in": 0, out: 20 });

        // firstAid
        var xPos = 470;
        this.instance = new lib.firstAid_MC();
        this.instance.parent = this;
        this.instance.setTransform(xPos, 83.2, 1, 1, 0, 0, 0, 41, 46);
        this.instance.alpha = 0;
        this.instance._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance)
            .wait(11)
            .to({ _off: false }, 0)
            .to({ y: 62.2, alpha: 1 }, 3)
            .to({ y: 73.2 }, 2)
            //.wait(5)
            //.to({ y: 62.2 }, 2)
            //.to({ y: 83.2, alpha: 0 }, 3)
            //.wait(9)
        );

        var bb = new AnimationWithWhiteStrip(lib, img, cjs, lib.txt);
        bb.showAnimatedText(this, lib.txt);

        CommonAnimationBase.call(this, lib, img, cjs, txt);
        this.initializeFrameHandler(this);

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = null;
    lib.txt = txt;
    // library properties:
    lib.properties = {
        width: 666,
        height: 250,
        fps: 24,
        color: "#FFFFFF",
        opacity: 1.00,
        webfonts: {},
        manifest: [
            { src: "animations/separated/commonEvents/images/first_aid.png", id: "first_aid" }
        ],
        preloads: []
    };

}
CommonAnimation_FirstAid.prototype = Object.create(CommonAnimationBase.prototype);
CommonAnimation_FirstAid.prototype.constructor = CommonAnimationBase;

// Common in possession event for second team
var CommonAnimation_Right_InPossession = function (lib, img, cjs, txt) {

    CommonAnimationBase.call(this, lib, img, cjs, txt);

    (lib.fieldColor_InPossession = function () {
        this.initialize(img.fieldColor_InPossession);
    }).prototype = p = new cjs.Bitmap();
    p.nominalBounds = new cjs.Rectangle(0, 0, 304, 154);// helper functions:

    (lib.field_InPossession_MC = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Layer 7
        this.instance = new lib.fieldColor_InPossession();
        this.instance.parent = this;
        this.instance.setTransform(-2, 2, 0.988, 0.983);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

    }).prototype = this.getMCSymbolPrototype(lib.field_InPossession_MC, new cjs.Rectangle(-2, 2, 300.3, 151.4), null);


    // stage content:
    (lib.getExportRoot = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, { "in": 0, out: 20 });

        // InPossession
        this.instance = new lib.field_InPossession_MC();
        this.instance.parent = this;
        this.instance.setTransform(488, 111, 1, 1, 0, 0, 0, 152, 77);
        this.instance.alpha = 0;
        this.instance._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance, {loop:true})
            .wait(2)
            .to({ _off: false }, 0)
            .to({ alpha: 1 }, 7)
            .wait(14)
            .to({ alpha: 0 }, 7)
            .wait(5)
        );

        //var bb = new AnimationWithBlackBox(lib, cjs, "animations/separated/commonEvents/images/IncidentsNameBG.png");
        //bb.showAnimatedText(this, "In possession");

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = null;
    // library properties:
    lib.properties = {
        width: 666,
        height: 250,
        fps: 24,
        color: "#FFFFFF",
        opacity: 1.00,
        webfonts: {},
        manifest: [
            { src: "animations/separated/commonEvents/images/fieldColor_InPossession_Left.png", id: "fieldColor_InPossession" }
        ],
        preloads: []
    };
}
CommonAnimation_Right_InPossession.prototype = Object.create(CommonAnimationBase.prototype);
CommonAnimation_Right_InPossession.prototype.constructor = CommonAnimationBase;

// Common event of in possession for home team
var CommonAnimation_Left_InPossession = function (lib, img, cjs, txt) {

    CommonAnimationBase.call(this, lib, img, cjs, txt);

    (lib.fieldColor_InPossession = function () {
        this.initialize(img.fieldColor_InPossession);
    }).prototype = p = new cjs.Bitmap();
    p.nominalBounds = new cjs.Rectangle(0, 0, 304, 154);// helper functions:

    (lib.field_InPossession_MC = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Layer 7
        this.instance = new lib.fieldColor_InPossession();
        this.instance.parent = this;
        this.instance.setTransform(-2, 2, 0.988, 0.983);

        this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

    }).prototype = this.getMCSymbolPrototype(lib.field_InPossession_MC, new cjs.Rectangle(-2, 2, 300.3, 151.4), null);


    // stage content:
    (lib.getExportRoot = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, { "in": 0, out: 20 });

        // InPossession
        this.instance = new lib.field_InPossession_MC();
        this.instance.parent = this;
        this.instance.setTransform(181, 111, 1, 1, 0, 0, 180, 152, 77);
        this.instance.alpha = 0;
        this.instance._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance, {loop:true}).wait(2).to({ _off: false }, 0).to({ alpha: 1 }, 7).wait(14).to({ alpha: 0 }, 7).wait(5));

        //var bb = new AnimationWithBlackBox(lib, cjs, "animations/separated/commonEvents/images/IncidentsNameBG.png");
        //bb.showAnimatedText(this, "In possession");

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = null;
    // library properties:
    lib.properties = {
        width: 666,
        height: 250,
        fps: 24,
        color: "#FFFFFF",
        opacity: 1.00,
        webfonts: {},
        manifest: [
            { src: "animations/separated/commonEvents/images/fieldColor_InPossession_Right.png", id: "fieldColor_InPossession" }
        ],
        preloads: []
    };
};
CommonAnimation_Left_InPossession.prototype = Object.create(CommonAnimationBase.prototype);
CommonAnimation_Left_InPossession.prototype.constructor = CommonAnimationBase;

// Common foul event with white stripe + whistle icon
var CommonAnimation_Foul = function (lib, img, cjs, txt) {

    CommonAnimationBase.call(this, lib, img, cjs, txt);

    (lib.whistleICON_MC = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, {});

        // Layer 2
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#294453").s().p("AAMBrQg1gFgpgyQgUgXgMgeQgMgegCghQgCgQACgPIABgLIAAAEQgCAPACARQACAhAMAeQAMAeAUAXQApAyA1AFQAsADAggdQAggdAJgwQgHAyghAfQgeAcgnAAIgJAAg");
        this.shape.setTransform(52.8, 70.6, 1, 1, 0, 0, 180);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#2A4857").s().p("AALBqQg1gGgogxQgSgWgNgdQgMghgCgdQgBgRABgNIACgOIAAAIQgBARACAMQACAXAJAYIAFANQANAcATAWQALAMALAJQAiAcAmAEQAcACAZgMQAXgLAQgXQAOgUAFgYQgJAtgdAdQgeAbgnAAIgLgBg");
        this.shape_1.setTransform(52.9, 70.6, 1, 1, 0, 0, 180);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#2B4B5B").s().p("AAIBoQgzgHgngwQgTgXgLgbQgNgdgCgfQgBgKABgTIADgNIgBAHQAAAMADAPQADAWAKAXIAFAMQAPAbASAUQAIAJAOALQAiAbAkADQAcADAYgLQAXgKAQgWQALgSAFgVQgJAtgdAbQgdAagmAAIgPAAg");
        this.shape_2.setTransform(52.9, 70.8, 1, 1, 0, 0, 180);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#2D4F5F").s().p("AAHBkQgygHgmgvQgTgWgLgbQgMgdgCgdQgCgOACgNIACgNIAAAHQABANADAMQAEASALAXIAFALQAOAZAUATQAMAMAKAIQAhAZAkAEQAbADAXgKQAXgKAPgUQAJgLAEgOQgKAngbAXQgbAaglAAQgJAAgKgCg");
        this.shape_3.setTransform(53, 71, 1, 1, 0, 0, 180);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#2E5263").s().p("AAGBiQgxgJglgtQgSgWgMgbQgLgcgDgcQgBgPABgLQABgIACgEIAAAGQABAHAEAQQAGAUAKATIAGAKQAOAWAVAUIAVASQAiAYAiAEQAbADAXgJQAWgJAPgSQAFgHAEgJQgLAkgYAUQgcAagmAAQgJAAgKgCg");
        this.shape_4.setTransform(53.1, 71.2, 1, 1, 0, 0, 180);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#305668").s().p("AADBfQgvgKglgsQgSgXgLgYQgMgcgCgaQgBgJABgQQABgGACgFIABAFIAGAVQAGARAMASIAHAKQAOAVAUASIAWARQAhAWAiAFQAaADAWgIQAWgIAOgRQAFgFACgGQgLAkgYAUQgbAYglAAQgLAAgMgCg");
        this.shape_5.setTransform(53.1, 71.4, 1, 1, 0, 0, 180);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#325A6C").s().p("AABBcQgvgKgjgrQgSgWgLgYQgLgcgCgZQgCgMACgLQAAgFADgGIABAFQACAJAFAKQAHAPANASIAHAJQAPATAUARIAWAQQAhAVAgAEQA1AIAegiIAFgHQgLAjgYAVQgcAXgkAAQgMAAgNgDg");
        this.shape_6.setTransform(53.1, 71.6, 1, 1, 0, 0, 180);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f("#335E71").s().p("AAABZQgvgLgigqQgQgUgNgZQgKgbgDgYQgBgNABgJIADgKIACAFIAIAQQAHAMAPASIAHAIQAOARAWAQQAJAIANAHQAgAUAgAFQAzAHAdgdIAEgFQgLAlgZATQgbAYgjAAQgNAAgOgEg");
        this.shape_7.setTransform(53.1, 71.8, 1, 1, 0, 0, 180);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#356275").s().p("AgDBWQgugMgggoQgRgVgLgYQgMgbgCgVQgBgLABgKIADgJIAMASQAFAHATAUIAGAHQASARATAOIAWANQAgATAfAFQAzAIAcgbIACgCQgMAngYATQgcAWgiAAQgPAAgPgEg");
        this.shape_8.setTransform(53.1, 72, 1, 1, 0, 0, 180);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f("#37677A").s().p("AgGBTQgrgMghgoQgRgUgLgXQgLgbgCgUQgBgLABgIIADgJIADADIALANQAKALAPAMIAIAHQAQAPAVAOQALAHALAFQAeARAgAFQAxAIAbgXIABgBQgMAogZAUQgbAWgiAAQgQAAgRgFg");
        this.shape_9.setTransform(53, 72.2, 1, 1, 0, 0, 180);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#396B7F").s().p("AgJBQQgrgNgggnQgOgSgNgYQgKgagDgTIAAgSIADgIIAyAoQAVAPARAKIAWAMQAeAPAfAFQAwAJAagUIACAAQAAAAgBAAQAAABAAAAQAAAAgBAAQAAAAAAAAQgMAqgaAUQgcAWggAAQgSAAgRgGg");
        this.shape_10.setTransform(52.9, 72.5, 1, 1, 0, 0, 180);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f("#3B7084").s().p("AgMBNQgpgOgfgmQgPgSgMgXQgKgXgDgUQgBgJABgIQABgEADgDIA1AiQAYAPAPAIIAWAKQAhAQAaADQAwAKAYgQQAAAAAAAAQAAAAABAAQAAAAAAABQAAAAAAABQgBABgCADQgMApgaASQgbAWghAAQgSAAgTgHg");
        this.shape_11.setTransform(52.9, 72.7, 1, 1, 0, 0, 180);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#3D748A").s().p("AgPBKQgogPgeglQgQgUgLgUQgKgZgCgQQgCgJACgGQABgFACgCIAEABIAOAHIAfAPIAIAEIAoAUIAVAKQAhAOAaAFQAvAIAWgMQADADgHAIQgNApgZARQgaAWghAAQgTAAgUgIg");
        this.shape_12.setTransform(52.8, 72.9, 1, 1, 0, 0, 180);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f("#3F798F").s().p("AgSBHQgmgPgegkQgQgTgKgUQgKgYgDgQIAAgOQABgDADgDIA0ARIBGAeQAgANAaAFQAuAKAVgKQABAGgHALQgOAngYAQQgbAWgfAAQgVAAgVgJg");
        this.shape_13.setTransform(52.7, 73.1, 1, 1, 0, 0, 180);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#427E95").s().p("AgVBEQglgQgdgjQgOgRgMgVQgKgbgCgLQgCgHACgGQABgDACgCIAFAAIARADQAQADASAGIBGAZQAhALAYAGQAuAKAUgHQgBAJgIAOQgPAngWAOQgbAWggAAQgVAAgWgKg");
        this.shape_14.setTransform(52.6, 73.4, 1, 1, 0, 0, 180);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f("#44839B").s().p("AgZBBQghgPgegkQgOgQgLgVQgLgYgCgLQgBgHABgFQABgEADAAIAFgBQAJgBAJACQAPAAAVAFIBHAVQAeAJAaAHQAuALARgFQgDAOgHAPQgQAlgWAOQgbAWgfAAQgVAAgZgLg");
        this.shape_15.setTransform(52.5, 73.6, 1, 1, 0, 0, 180);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f("#4689A1").s().p("AgcA/Qg0gZgig9QgJgXgDgJQgDgPAHgBQAWgGAoAGQAaAEAuAMIBFASQAiAJANgCQgTBCgfARQgZAUgcACIgGAAQgXAAgYgMg");
        this.shape_16.setTransform(52.5, 73.7, 1, 1, 0, 0, 180);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f("#FFFFFF").s().p("ABvAsIAAgIQgFhCgpgyQgqgzg1gEQgzgFgjApQARgXAXgLQAYgLAcACQA1AEAqAzQApAyAFBCIAAAIQACBAgkAqQAegogCg7g");
        this.shape_17.setTransform(50.6, 62.1, 1, 1, 0, 0, 180);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f("#275B71").s().p("AhjgXIAdAWQAcAUAUAEQAeAGAigQQAfgOAbgdQgDAKgPAQQgXAYgfAHQgOAEgMAAQg2AAgvg2g");
        this.shape_18.setTransform(51.2, 78.1, 1, 1, 0, 0, 180);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f("#FFFFFF").s().p("AhRAFQATgZAegHQAfgHAYAGQAoAKAhAmIgdgVQgbgVgVgEQgygLhABFQADgNALgOg");
        this.shape_19.setTransform(53.7, 51.5, 1, 1, 0, 0, 180);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f("#EFF1F4").s().p("AhTAFQATgZAegIQAegJAcAIQAoAKAiAoIgagRQgagRgUgDQgdgFgkARQgeANgcAZQADgNALgQg");
        this.shape_20.setTransform(53.7, 51.7, 1, 1, 0, 0, 180);

        this.shape_21 = new cjs.Shape();
        this.shape_21.graphics.f("#E2E8EC").s().p("AhUAFQASgaAdgIQAfgLAfAJQApAMAhApIgWgNQgZgNgSgDQgfgDgpAOQggAMgdAUQACgNANgSg");
        this.shape_21.setTransform(53.7, 52, 1, 1, 0, 0, 180);

        this.shape_22 = new cjs.Shape();
        this.shape_22.graphics.f("#D5DFE5").s().p("AhVAFQASgbAcgIQAfgNAiALQApAMAjArIgVgIQgWgKgSgDQgxgDhdAnQADgOANgTg");
        this.shape_22.setTransform(53.7, 52.2, 1, 1, 0, 0, 180);

        this.shape_23 = new cjs.Shape();
        this.shape_23.graphics.f("#C9D6DF").s().p("AhXAFQASgbAcgJQAggPAkAMQAqAOAiAsQAAABgRgFIglgIQgegBg1AMQg2APgOACQACgPANgUg");
        this.shape_23.setTransform(53.6, 52.4, 1, 1, 0, 0, 180);

        this.shape_24 = new cjs.Shape();
        this.shape_24.graphics.f("#BDCED8").s().p("AhoAqQACgQAOgVQASgcAbgKQAhgQAmANQAqAPAjAtQABAEgygHQgaAAg+AMQg2AKgPAAIgDgBg");
        this.shape_24.setTransform(53.6, 52.6, 1, 1, 0, 0, 180);

        this.shape_25 = new cjs.Shape();
        this.shape_25.graphics.f("#B2C6D2").s().p("AhqAsQACgRAOgXQASgdAbgKQAigSAoAPQArAPAiAvQACAEgNACQgOACgRgCQgTABhLAKQgkAFgUAAQgOAAgGgCg");
        this.shape_25.setTransform(53.6, 52.9, 1, 1, 0, 0, 180);

        this.shape_26 = new cjs.Shape();
        this.shape_26.graphics.f("#A7BECC").s().p("AhsArQACgRAOgYQASgeAagKQAjgVAqAQQAsARAjAwQADAGgMAGQgMAGgQgCIhkAKQgWADgRAAQgeAAgKgIg");
        this.shape_26.setTransform(53.5, 53.4, 1, 1, 0, 0, 180);

        this.shape_27 = new cjs.Shape();
        this.shape_27.graphics.f("#9CB7C7").s().p("AhuArQACgTAOgYQASgfAagLQAkgWAsARQAsASAjAxQAEAHgKAJQgKAKgPgCQhFAIglADIgYABQguAAgMgNg");
        this.shape_27.setTransform(53.5, 53.9, 1, 1, 0, 0, 180);

        this.shape_28 = new cjs.Shape();
        this.shape_28.graphics.f("#91B0C2").s().p("AhwAqQACgUAOgZQASggAZgLQAmgZAtATQAuATAjAzQAFAIgIANQgJANgOgBQhhAJgOABIgMAAQg9AAgNgTg");
        this.shape_28.setTransform(53.4, 54.4, 1, 1, 0, 0, 180);

        this.shape_29 = new cjs.Shape();
        this.shape_29.graphics.f("#87AABC").s().p("AhyApQACgVAPgaQARghAZgMQAngaAvAUQAuAUAjA0QAHAKgHAQQgHARgNgBQhPAKgmAAQhMAAgNgag");
        this.shape_29.setTransform(53.4, 55, 1, 1, 0, 0, 180);

        this.shape_30 = new cjs.Shape();
        this.shape_30.graphics.f("#7DA4B7").s().p("Ah1AnQACgWAPgbQASghAYgNQAogcAxAWQAvAUAjA2QAIALgFAUQgFAVgMgBQhEAKguAAQhYAAgOgig");
        this.shape_30.setTransform(53.3, 55.6, 1, 1, 0, 0, 180);

        this.shape_31 = new cjs.Shape();
        this.shape_31.graphics.f("#739EB3").s().p("AgXBOQhUgEgMglQACgWAPgdQASghAXgOQAqgeAyAXQAwAWAjA3QAJALgDAYQgDAZgMAAQg6AKgxAAIgVgBg");
        this.shape_31.setTransform(53.2, 56.2, 1, 1, 0, 0, 180);

        this.shape_32 = new cjs.Shape();
        this.shape_32.graphics.f("#6898AE").s().p("AgWBUQhZgGgLgqQABgYAQgdQASgjAWgOQAsggA0AZQAxAXAiA4QAKAMgBAcQgBAcgLABQg0AKgyAAIgfgBg");
        this.shape_32.setTransform(53, 56.8, 1, 1, 0, 0, 180);

        this.shape_33 = new cjs.Shape();
        this.shape_33.graphics.f("#5E93A9").s().p("AgWBZQhdgIgKgvQABgZAQgeQASgjAWgPQAtghA2AaQAxAXAjA6QALANAAAgQABAggKABQgxAKgyAAQgTAAgVgCg");
        this.shape_33.setTransform(52.9, 57.4, 1, 1, 0, 0, 180);

        this.shape_34 = new cjs.Shape();
        this.shape_34.graphics.f("#528EA5").s().p("AgWBfQhigLgJg0QACgZAQggQARgjAVgQQAvgjA4AbQAyAZAjA7QALAOADAkQADAjgJACQgwAKgyAAQgYAAgXgCg");
        this.shape_34.setTransform(52.7, 58, 1, 1, 0, 0, 180);

        this.shape_35 = new cjs.Shape();
        this.shape_35.graphics.f("#4689A1").s().p("AgWBkQhmgNgJg5QACgaARghQARgkAUgQQAxgmA5AdQAzAaAiA+QANANAFAoQAFAngIACQgvALgxAAQgcAAgbgDg");
        this.shape_35.setTransform(52.5, 58.6, 1, 1, 0, 0, 180);

        this.shape_36 = new cjs.Shape();
        this.shape_36.graphics.f("#F5FBFB").s().p("AgkAuQgrgIgmgmIAfASQAeARAXADQAjAHAsgZQAsgYAcgqQgDAMgZAfQgiAnggAHQgYAEgRAAQgLAAgIgBg");
        this.shape_36.setTransform(48.3, 80.5, 1, 1, 0, 0, 180);

        this.shape_37 = new cjs.Shape();
        this.shape_37.graphics.f("#E8EFF2").s().p("Ah3gCQABgDAbAOQAiATATADQAlAIAtgXQAvgXAegpQgrBQgyALQgVAGgSAAQg8AAgwgzg");
        this.shape_37.setTransform(48.5, 80.4, 1, 1, 0, 0, 180);

        this.shape_38 = new cjs.Shape();
        this.shape_38.graphics.f("#DBE5EB").s().p("AglAwQgtgLgngpQgBgKAaAOQAlAVAPADQAmAKAxgWQAygWAdgoQgBANgaAhQggAogfAIQgVAHgUAAQgOAAgOgDg");
        this.shape_38.setTransform(48.6, 80.2, 1, 1, 0, 0, 180);

        this.shape_39 = new cjs.Shape();
        this.shape_39.graphics.f("#D0DCE4").s().p("AglAxQgvgMgngrQgEgSAaAPQApAXALACQAmANA0gVQA1gUAfgoQgCAOgZAiQgeAogfAIQgWAJgVAAQgQAAgPgEg");
        this.shape_39.setTransform(48.7, 80.1, 1, 1, 0, 0, 180);

        this.shape_40 = new cjs.Shape();
        this.shape_40.graphics.f("#C4D4DE").s().p("AglAyQgwgNgoguQgGgYAaAPQAsAZAHACQAmAPA4gUQA4gTAfgnQgCAQgYAiQgeAogeAJQgWAKgWAAQgRAAgRgFg");
        this.shape_40.setTransform(48.9, 79.9, 1, 1, 0, 0, 180);

        this.shape_41 = new cjs.Shape();
        this.shape_41.graphics.f("#B9CCD7").s().p("AglAzQgxgOgogwQgKgfAaAPQAwAcACAAQAnASA7gTQA7gRAhgmQgCAQgYAjQgdAogeAKQgWAKgYAAQgRAAgTgFg");
        this.shape_41.setTransform(49, 79.8, 1, 1, 0, 0, 180);

        this.shape_42 = new cjs.Shape();
        this.shape_42.graphics.f("#AEC4D1").s().p("AgkA0QgzgQgogxQgNgnAaAQIAyAfQAnASA+gQQA+gRAiglQgCASgXAiQgcApgdAKQgYAMgaAAQgRAAgUgGg");
        this.shape_42.setTransform(49.3, 79.6, 1, 1, 0, 0, 180);

        this.shape_43 = new cjs.Shape();
        this.shape_43.graphics.f("#A3BDCC").s().p("AgkA1Qg0gRgog0QgQgtAaAQIAxAgQAoAVBBgPQBBgQAjgkQgCATgWAjQgbApgdALQgZANgbAAQgTAAgVgHg");
        this.shape_43.setTransform(49.5, 79.5, 1, 1, 0, 0, 180);

        this.shape_44 = new cjs.Shape();
        this.shape_44.graphics.f("#99B6C6").s().p("AgjA2Qg2gTgpg2QgTg0AbAQQAPAKAhAYQAoAXBFgOQBEgOAkgjQgCAUgWAkQgaAogdAMQgZAPgdAAQgTAAgWgIg");
        this.shape_44.setTransform(49.7, 79.4, 1, 1, 0, 0, 180);

        this.shape_45 = new cjs.Shape();
        this.shape_45.graphics.f("#8FAFC1").s().p("AgjA6Qg3gVgpg3QgWg8AbARQAPAJAhAaQAoAaBIgNQBHgNAlgjQgCAWgVAkQgZAogdANQgaAQgdAAQgVAAgYgIg");
        this.shape_45.setTransform(49.9, 79, 1, 1, 0, 0, 180);

        this.shape_46 = new cjs.Shape();
        this.shape_46.graphics.f("#85A9BC").s().p("AgiA+Qg4gVgqg6QgZhEAbASQAPAJAgAcQApAcBMgMQBJgLAmgiQgCAXgVAkQgYApgbANQgbASgfAAQgWAAgZgKg");
        this.shape_46.setTransform(50.1, 78.5, 1, 1, 0, 0, 180);

        this.shape_47 = new cjs.Shape();
        this.shape_47.graphics.f("#7BA3B7").s().p("AghBDQg6gXgpg8QgdhLAcASQAOAKAgAdQApAeBPgKQBNgKAmgiQgCAZgUAkQgXApgbAOQgcATghAAQgWAAgagKg");
        this.shape_47.setTransform(50.4, 78, 1, 1, 0, 0, 180);

        this.shape_48 = new cjs.Shape();
        this.shape_48.graphics.f("#719DB2").s().p("AghBHQg7gYgqg+QgfhRAbASQAPAJAfAfQAqAgBSgIQBPgJAoghQgCAbgTAjQgWApgbAPQgdAUghAAQgYAAgcgLg");
        this.shape_48.setTransform(50.6, 77.5, 1, 1, 0, 0, 180);

        this.shape_49 = new cjs.Shape();
        this.shape_49.graphics.f("#6798AE").s().p("AggBMQg9gagphAQgjhYAcASQAOAKAfAgQAqAiBWgHQBRgHApggQgBAbgTAkQgVAqgbAQQgeAVgiAAQgZAAgdgMg");
        this.shape_49.setTransform(50.8, 77, 1, 1, 0, 0, 180);

        this.shape_50 = new cjs.Shape();
        this.shape_50.graphics.f("#5D93A9").s().p("AgfBRQg/gbgphCQgmhgAcATQAPAKAeAiQAqAkBZgGQBUgFArggQgCAdgSAkQgVAqgZAQQggAXgkAAQgZAAgegNg");
        this.shape_50.setTransform(51.1, 76.4, 1, 1, 0, 0, 180);

        this.shape_51 = new cjs.Shape();
        this.shape_51.graphics.f("#528EA5").s().p("AgeBVQhBgcgphEQgphnAcATQAPAKAdAjQArAmBdgEQBXgEArgfQgCAegRAlQgUApgZASQggAYgmAAQgbAAgegOg");
        this.shape_51.setTransform(51.3, 76, 1, 1, 0, 0, 180);

        this.shape_52 = new cjs.Shape();
        this.shape_52.graphics.f("#4689A1").s().p("AgdBaQhCgdgqhHQgshuAcATQAPALAdAlQArAoBggDQBZgCAugfQgDAggQAlQgTApgYASQgiAagmAAQgdAAgfgPg");
        this.shape_52.setTransform(51.6, 75.4, 1, 1, 0, 0, 180);

        this.shape_53 = new cjs.Shape();
        this.shape_53.graphics.f("#F5FBFB").s().p("ABDAMQgVgGhLgZQg9gVglgIQhMgPgyAKQgiAMAAgBQgPgJAYgOQAVgMAMAAQA2gGBAAVIGkCOQiBgohhgcg");
        this.shape_53.setTransform(33.6, 51.8, 1, 1, 0, 0, 180);

        this.shape_54 = new cjs.Shape();
        this.shape_54.graphics.f("#E8EFF2").s().p("ABQAWIhkghQg+gVgmgIQhGgIg6AHQgoAFgBgDQgNgKAXgOQATgMAPgCQA1gGBCAVIGlCOIjXg6g");
        this.shape_54.setTransform(33.7, 51.7, 1, 1, 0, 0, 180);

        this.shape_55 = new cjs.Shape();
        this.shape_55.graphics.f("#DBE5EB").s().p("AC5A2IhdgWIhngiQg/gWgngIQgvgBhTAFQgqACgGgLQgNgKAYgPQARgLARgEQAzgHBHAWIGkCOIhvgag");
        this.shape_55.setTransform(33.8, 51.7, 1, 1, 0, 0, 180);

        this.shape_56 = new cjs.Shape();
        this.shape_56.graphics.f("#D0DCE4").s().p("ADBA7IhYgRIhrgkQhAgVgpgJQhmAJgeAAQgsAAgKgTQgLgLAWgPQASgLASgFQAegFAhAFQAaAEAjALIGkCNIhpgVg");
        this.shape_56.setTransform(33.9, 51.6, 1, 1, 0, 0, 180);

        this.shape_57 = new cjs.Shape();
        this.shape_57.graphics.f("#C4D4DE").s().p("ADIBBQg6gIgYgFIhwglQhBgWgpgJQhiAPgkgCQgugCgQgaQgJgMAWgPQAQgLAUgHQAygJBMAYIGlCNQgggGhEgJg");
        this.shape_57.setTransform(34, 51.6, 1, 1, 0, 0, 180);

        this.shape_58 = new cjs.Shape();
        this.shape_58.graphics.f("#B9CCD7").s().p("ADPBGQg3gEgWgEIhzgnQhCgWgqgJQhaAVgugEQgxgEgUgiQgIgMAWgQQAQgLAVgIQAygKBOAZIGkCNQgegEhAgGg");
        this.shape_58.setTransform(34.1, 51.5, 1, 1, 0, 0, 180);

        this.shape_59 = new cjs.Shape();
        this.shape_59.graphics.f("#AEC4D1").s().p("ADWBMQgzgBgUgDIh3goQhCgXgsgJQhXAcgzgGQgzgHgZgpQgHgNAWgQQAQgMAWgIQAegHAkAFQAZAEAnAMIGkCNQgbgCg+gCg");
        this.shape_59.setTransform(34.2, 51.5, 1, 1, 0, 0, 180);

        this.shape_60 = new cjs.Shape();
        this.shape_60.graphics.f("#A3BDCC").s().p("ACcBRIh7gqQhDgWgtgLQikBHg7hlQgGgOAVgQQARgNAWgJQAfgIAkAGQAZAEAoANIDSBFIDSBHQgZgBg6ADIgoABIgZgBg");
        this.shape_60.setTransform(34.3, 51.5, 1, 1, 0, 0, 180);

        this.shape_61 = new cjs.Shape();
        this.shape_61.graphics.f("#99B6C6").s().p("ACpBWIh/grQhDgWgvgMQhSAsg8gMQg4gKgig6QgFgOAVgRQAQgNAYgKQAfgIAlAGQAXAEArANIGkCMQgaABg0AGQgpAFgPAAIgDAAg");
        this.shape_61.setTransform(34.4, 52, 1, 1, 0, 0, 180);

        this.shape_62 = new cjs.Shape();
        this.shape_62.graphics.f("#8FAFC1").s().p("AA0AvQhGgXgvgMQhRAzg/gOQg7gNgmhBQgEgPAWgRQAPgOAZgKQAfgJAmAGQAXADAsAOIDRBHQCpA4ApANQgZADgvAKQgqAJgMAAIiBgsg");
        this.shape_62.setTransform(34.5, 52.4, 1, 1, 0, 0, 180);

        this.shape_63 = new cjs.Shape();
        this.shape_63.graphics.f("#85A9BC").s().p("Ag6APQhQA6hCgQQg9gPgrhJQgCgQAUgSQARgOAZgLQAfgJAnAGQAXADAsAOIDSBHIDSBFQgYAGgrANIgwANQiyg+hKgTg");
        this.shape_63.setTransform(34.6, 52.9, 1, 1, 0, 0, 180);

        this.shape_64 = new cjs.Shape();
        this.shape_64.graphics.f("#7BA3B7").s().p("AgzASQhOBBhGgTQg/gRgwhRQAAgQAUgSQARgPAZgLQAggLAnAHQAXADAuAPIDRBGIDSBFQgYAJhPAhQiqg8hZgXg");
        this.shape_64.setTransform(34.8, 53.3, 1, 1, 0, 0, 180);

        this.shape_65 = new cjs.Shape();
        this.shape_65.graphics.f("#719DB2").s().p("AgsAWQhNBIhJgVQhCgUg0hZQABgRATgSQARgQAbgMQAggLAoAHQAWADAwAPIDRBHIDSBFQgbANgdAQQgdARgIAGQilg7hjgag");
        this.shape_65.setTransform(34.9, 53.7, 1, 1, 0, 0, 180);

        this.shape_66 = new cjs.Shape();
        this.shape_66.graphics.f("#6798AE").s().p("AglAZQhMBPhMgYQhDgVg6hhQACgSAUgTQARgQAbgMQAggMApAHQAXADAvAQIDSBGIDSBFQhLAygGAMQijg7hsgcg");
        this.shape_66.setTransform(35, 54.2, 1, 1, 0, 0, 180);

        this.shape_67 = new cjs.Shape();
        this.shape_67.graphics.f("#5D93A9").s().p("AgdAcQhMBWhPgaQhGgXg9hpQADgUATgSQARgRAbgNQAhgMApAGQAWAEAyAQIDSBGIDRBFIgtApQgYAXgBAIQiYg4h7ghg");
        this.shape_67.setTransform(35.2, 54.6, 1, 1, 0, 0, 180);

        this.shape_68 = new cjs.Shape();
        this.shape_68.graphics.f("#528EA5").s().p("AgXAfQhKBehSgdQhIgahDhxQALgqA6gbQAigNApAGQAXAEAyAQIDRBGQCPAvBEAWIgoAuQgWAbACAJQidg5h9gig");
        this.shape_68.setTransform(35.3, 55.1, 1, 1, 0, 0, 180);

        this.shape_69 = new cjs.Shape();
        this.shape_69.graphics.f("#4689A1").s().p("AgQAiQhIBlhVgfQhLgchHh5QAOgtA4gbQAigOAqAHQAWAEA0AQIDRBGQCMAuBHAXIgjA0QgTAeAFAKQiWg4iKglg");
        this.shape_69.setTransform(35.4, 55.5, 1, 1, 0, 0, 180);

        this.shape_70 = new cjs.Shape();
        this.shape_70.graphics.lf(["#D1DDE0", "#6397AF"], [0, 1], -1.5, 4, 0.7, -2.9).s().p("AgwASIBhg3IgiBIIgEADg");
        this.shape_70.setTransform(-7.3, 54.4, 1, 1, 0, 0, 180);

        this.shape_71 = new cjs.Shape();
        this.shape_71.graphics.lf(["#4F7A94", "#3B5063"], [0, 1], -1, -2.1, 1.9, 4.2).s().p("Ag2AHICShXIgiBJIiVBYg");
        this.shape_71.setTransform(-2.9, 58.7, 1, 1, 0, 0, 180);

        this.shape_72 = new cjs.Shape();
        this.shape_72.graphics.f("#CCDFE6").s().p("Ag+AEICuhnIgxBgIiuBng");
        this.shape_72.setTransform(-2.9, 58.6, 1, 1, 0, 0, 180);

        this.shape_73 = new cjs.Shape();
        this.shape_73.graphics.lf(["#D1DDE0", "#6397AF"], [0, 1], -1.8, 3.5, 1.1, -2).s().p("Ag+AHIA9gjIBAAUIhAAlg");
        this.shape_73.setTransform(28.5, 40.4, 1, 1, 0, 0, 180);

        this.shape_74 = new cjs.Shape();
        this.shape_74.graphics.lf(["#4F7A94", "#3B5063"], [0, 1], -2.8, 2.8, 3.2, -3).s().p("Ag/AIIBBgmIA+AXIhBAmg");
        this.shape_74.setTransform(35, 44.1, 1, 1, 0, 0, 180);

        this.shape_75 = new cjs.Shape();
        this.shape_75.graphics.lf(["#FFFFFF", "#45637A", "#A5BAC8"], [0, 0.322, 1], -12.4, 25.5, 5.9, -12).s().p("AhhAdICChNIBBAUIiCBNg");
        this.shape_75.setTransform(32, 42.3, 1, 1, 0, 0, 180);

        this.shape_76 = new cjs.Shape();
        this.shape_76.graphics.lf(["#4F7A94", "#3B5063"], [0, 1], -3.3, -4, 0.3, 0.3).s().p("AhtAeICOhUIBNAYIiOBVg");
        this.shape_76.setTransform(31.9, 41.7, 1, 1, 0, 0, 180);

        this.shape_77 = new cjs.Shape();
        this.shape_77.graphics.f("#FFFFFF").s().p("AhtAeICOhTIBNAXIiOBVg");
        this.shape_77.setTransform(32.6, 41.5, 1, 1, 0, 0, 180);

        this.shape_78 = new cjs.Shape();
        this.shape_78.graphics.f("#4689A1").s().p("AivDMQhFgagthOQgshOAFhQQAEhSAzgsQAYgUAegHQAggHAhAKIAAAAIAFACIHfCaIgxBfIkdhgQAJAdAEAbIAEAWQABALgCAZQgCAggQAmQgTApgYASQgaAUggAEIgPABQgaAAgbgLg");
        this.shape_78.setTransform(36.3, 64.3, 1, 1, 0, 0, 180);

        this.shape_79 = new cjs.Shape();
        this.shape_79.graphics.f("#FFFFFF").s().p("AkchIQgNgEgSgCQgVgBgTAGQAPgGALgCQASgDAUAHQAXAKAMABQARACATAGQA7AGBPAeQB3AsAJACQCaAvCchSIidBdg");
        this.shape_79.setTransform(21.5, 49.8, 1, 1, 0, 0, 180);

        this.shape_80 = new cjs.Shape();
        this.shape_80.graphics.f("#F7F9FA").s().p("AkbhGQgNgEgSgCQgWgBgVAGQASgHAMgDQAYgFARAGQAXAIAOABQASACAUAGQA4AGBOAdICBAvQCfAxCThNIieBdg");
        this.shape_80.setTransform(21.6, 49.6, 1, 1, 0, 0, 180);

        this.shape_81 = new cjs.Shape();
        this.shape_81.graphics.f("#F2F5F7").s().p("AkbhEQgMgEgSgCQgXgBgVAGQATgIAOgDQAcgIAPAFQAVAGASACQASABAVAHQA0AGBOAcICDAwQCkAyCIhIIieBdg");
        this.shape_81.setTransform(21.7, 49.4, 1, 1, 0, 0, 180);

        this.shape_82 = new cjs.Shape();
        this.shape_82.graphics.f("#EDF2F4").s().p("AkYhCQgNgEgSgCQgZgBgYAIQAYgKAPgFQAhgLAOAFQASAEAWACQASABAXAIQAwAFBOAcICEAwQCpA0B+hDIidBdg");
        this.shape_82.setTransform(21.9, 49.2, 1, 1, 0, 0, 180);

        this.shape_83 = new cjs.Shape();
        this.shape_83.graphics.f("#E8EEF1").s().p("AkXhAQgNgEgSgBQgagCgYAJIAqgSQAkgNAMAEQAQADAbACQATABAYAIQBLAIC0BIQCuA2B0g+IidBeg");
        this.shape_83.setTransform(22, 49, 1, 1, 0, 0, 180);

        this.shape_84 = new cjs.Shape();
        this.shape_84.graphics.f("#E3EBEE").s().p("AkYg9QgMgEgSgCQgagCgYAJIArgTQApgQALAEQAVACAXABQASABAaAIQBFAIC4BIQCyA3Brg4IieBdg");
        this.shape_84.setTransform(22, 48.7, 1, 1, 0, 0, 180);

        this.shape_85 = new cjs.Shape();
        this.shape_85.graphics.f("#DEE8EC").s().p("AkXg7QgNgEgSgBQgagCgZAJIAugVQAsgTAKADQAWACAYgBQAUACAbAIQA+AHC8BJQC2A4Big0IieBfg");
        this.shape_85.setTransform(22, 48.5, 1, 1, 0, 0, 180);

        this.shape_86 = new cjs.Shape();
        this.shape_86.graphics.f("#DAE5E9").s().p("AkVg5QgNgEgSgBQgcgCgbALIA0gYQAwgXAJAEIAvgBQAUABAdAJQA4AGC/BKQC7A6BYgwIieBfg");
        this.shape_86.setTransform(22.3, 48.3, 1, 1, 0, 0, 180);

        this.shape_87 = new cjs.Shape();
        this.shape_87.graphics.f("#D5E2E7").s().p("AkSg1QgNgEgSgBQgfgDgeAOIA7gdQA0gZAIADQAlgDAMABQAUABAeAKQAyAFDEBKQC/A7BOgqIieBfg");
        this.shape_87.setTransform(22.5, 47.9, 1, 1, 0, 0, 180);

        this.shape_88 = new cjs.Shape();
        this.shape_88.graphics.f("#D0DFE5").s().p("AkSgyQgMgEgSgBQgggCgeAOIA9gfQA3gcAHACQAjgFARABQAUABAfAKQAsAFDHBKQDEA9BEglIieBfg");
        this.shape_88.setTransform(22.6, 47.6, 1, 1, 0, 0, 180);

        this.shape_89 = new cjs.Shape();
        this.shape_89.graphics.f("#CCDCE3").s().p("AkQguQgNgEgSgCQghgCggAQIBCgjQA7geAGACQAhgHAUABQAVABAgAKQAmAEDLBKQDIA/A7gfIieBeg");
        this.shape_89.setTransform(22.7, 47.2, 1, 1, 0, 0, 180);

        this.shape_90 = new cjs.Shape();
        this.shape_90.graphics.f("#C7D9E1").s().p("AkQgrQgNgEgSgBQghgDggAQIBEgkQA+giAGACQAfgIAYABQAVABAhALQAfADDQBKQDNBAAwgaIieBfg");
        this.shape_90.setTransform(22.8, 46.9, 1, 1, 0, 0, 180);

        this.shape_91 = new cjs.Shape();
        this.shape_91.graphics.f("#C2D6DE").s().p("AkQgoQgMgEgSgBQgigDggARIBGgnQBCgkAEABQAfgKAaABQAWABAiALQAZADDTBKQDRBCAngVIieBfg");
        this.shape_91.setTransform(22.8, 46.6, 1, 1, 0, 0, 180);

        this.shape_92 = new cjs.Shape();
        this.shape_92.graphics.f("#BED4DC").s().p("AkPgkQgMgEgSgCQgjgCghASIBJgqQBGgnADABQAfgMAcABQAXABAjALQATACDWBKQDWBEAdgPIieBeg");
        this.shape_92.setTransform(22.9, 46.2, 1, 1, 0, 0, 180);

        this.shape_93 = new cjs.Shape();
        this.shape_93.graphics.f("#B9D1DA").s().p("AkPghQgMgEgSgBQgjgDghASIBLgrQBJgqACAAQAfgOAeACQAXABAlAMIDnBLQDaBFATgKIieBfg");
        this.shape_93.setTransform(22.9, 45.9, 1, 1, 0, 0, 180);

        this.shape_94 = new cjs.Shape();
        this.shape_94.graphics.f("#B5CED8").s().p("AkNgeQgNgEgSgBQgkgDgiATICchbQAfgPAgABQAYABAmAMQAGABDeBKQDfBHAJgFIidBfgAlygTIAAAAIAAAAg");
        this.shape_94.setTransform(23, 45.6, 1, 1, 0, 0, 180);

        this.shape_95 = new cjs.Shape();
        this.shape_95.graphics.f("#B0CBD6").s().p("AkNgaQgNgEgSgCQgkgCgiATIChhgQAegSAiACQAZABAnAMIHECUIidBeg");
        this.shape_95.setTransform(23, 45.2, 1, 1, 0, 0, 180);

        this.shape_96 = new cjs.Shape();
        this.shape_96.graphics.f("#A9C6D2").s().p("AkOgaQgNgEgRgCQglgCgiATICihhQAfgRAhACQAYABAnAMIHGCTIifBfg");
        this.shape_96.setTransform(23.1, 45.3, 1, 1, 0, 0, 180);

        this.shape_97 = new cjs.Shape();
        this.shape_97.graphics.f("#A2C1CE").s().p("AkOgaQgNgEgSgCQgkgCgjATICkhhQAdgRAjABQAYABAnANIHFCTIigBgg");
        this.shape_97.setTransform(23.1, 45.3, 1, 1, 0, 0, 180);

        this.shape_98 = new cjs.Shape();
        this.shape_98.graphics.f("#9BBCCA").s().p("AkPgZQgNgFgSgBQgjgDgjATICkhhQAegRAiABQAZABAnANIHFCTIihBgg");
        this.shape_98.setTransform(23.2, 45.3, 1, 1, 0, 0, 180);

        this.shape_99 = new cjs.Shape();
        this.shape_99.graphics.f("#95B7C6").s().p("AkQgZQgMgEgSgCQgkgCgjASIClhiQAfgRAiACQAYABAnAMIHGCTIiiBhg");
        this.shape_99.setTransform(23.2, 45.4, 1, 1, 0, 0, 180);

        this.shape_100 = new cjs.Shape();
        this.shape_100.graphics.f("#8EB3C3").s().p("AkQgZQgNgEgSgBQgkgDgiATIClhiQAfgSAiACQAYABAnAMIHGCTIijBig");
        this.shape_100.setTransform(23.3, 45.4, 1, 1, 0, 0, 180);

        this.shape_101 = new cjs.Shape();
        this.shape_101.graphics.f("#88AEBF").s().p("AkRgZQgMgEgSgBQgkgDgjATICnhjQAegRAiABQAZABAmANIHHCTIilBig");
        this.shape_101.setTransform(23.3, 45.4, 1, 1, 0, 0, 180);

        this.shape_102 = new cjs.Shape();
        this.shape_102.graphics.f("#82AABC").s().p("AkRgYQgNgEgSgCQgkgCgiATICnhkQAegRAiABQAZABAnANIHGCTIilBig");
        this.shape_102.setTransform(23.4, 45.4, 1, 1, 0, 0, 180);

        this.shape_103 = new cjs.Shape();
        this.shape_103.graphics.f("#7BA6B9").s().p("AkSgZQgMgEgSgBQgkgDgjATICohkQAfgRAiACQAYABAnAMIHHCTIinBjg");
        this.shape_103.setTransform(23.4, 45.5, 1, 1, 0, 0, 180);

        this.shape_104 = new cjs.Shape();
        this.shape_104.graphics.f("#75A2B5").s().p("AkSgYQgNgEgSgCQgkgCgiATICphlQAegRAiACQAZABAnAMIHGCTIinBkg");
        this.shape_104.setTransform(23.5, 45.5, 1, 1, 0, 0, 180);

        this.shape_105 = new cjs.Shape();
        this.shape_105.graphics.f("#6F9EB2").s().p("AkTgYQgNgEgRgBQglgDgiATICqhlQAfgRAiABQAYABAnANIHHCSIipBlg");
        this.shape_105.setTransform(23.6, 45.6, 1, 1, 0, 0, 180);

        this.shape_106 = new cjs.Shape();
        this.shape_106.graphics.f("#689AAF").s().p("AkTgXQgNgEgSgCQgkgCgjATICrhmQAfgRAiABQAZABAmANIHHCSIiqBlg");
        this.shape_106.setTransform(23.6, 45.6, 1, 1, 0, 0, 180);

        this.shape_107 = new cjs.Shape();
        this.shape_107.graphics.f("#6296AC").s().p("AkUgXQgMgEgSgCQgkgCgjATICshmQAegSAiACQAYABAnAMIHICTIirBlg");
        this.shape_107.setTransform(23.7, 45.6, 1, 1, 0, 0, 180);

        this.shape_108 = new cjs.Shape();
        this.shape_108.graphics.f("#5B93A9").s().p("AkVgXQgMgEgSgBQgkgDgjATICthmQAfgSAhACQAZABAmAMIHICTIisBmg");
        this.shape_108.setTransform(23.7, 45.6, 1, 1, 0, 0, 180);

        this.shape_109 = new cjs.Shape();
        this.shape_109.graphics.f("#548FA6").s().p("AkVgXQgMgEgTgBQgjgDgjATICthnQAegRAjABQAYABAnANIHICSIitBng");
        this.shape_109.setTransform(23.8, 45.7, 1, 1, 0, 0, 180);

        this.shape_110 = new cjs.Shape();
        this.shape_110.graphics.f("#4D8CA4").s().p("AkVgXQgNgEgSgBQgkgDgjATICvhnQAegRAiABQAYABAnAMIHJCTIiuBng");
        this.shape_110.setTransform(23.8, 45.7, 1, 1, 0, 0, 180);

        this.shape_111 = new cjs.Shape();
        this.shape_111.graphics.f("#4689A1").s().p("AkWgXQgNgEgSgBQgkgDgiATICvhoQAegRAiACQAZABAnAMIHICSIivBog");
        this.shape_111.setTransform(23.9, 45.8, 1, 1, 0, 0, 180);

        this.shape_112 = new cjs.Shape();
        this.shape_112.graphics.f("#F5FBFB").s().p("AhCAiQAigRAGgJQAFgIgSABIB0gsQAOgBgFAGIgIAIQgVAKiQBAg");
        this.shape_112.setTransform(32.5, 70.6, 1, 1, 0, 0, 180);

        this.shape_113 = new cjs.Shape();
        this.shape_113.graphics.lf(["#F2F8F9", "#F2F8F9"], [0, 1], 6, 2, -6.3, -0.8).s().p("AhJAnQAigRAGgNQAFgJgOgCQAMgCAqgQIA8gXQAOABgFAGIgIAJQhyAxgoAWg");
        this.shape_113.setTransform(31.8, 70.3, 1, 1, 0, 0, 180);

        this.shape_114 = new cjs.Shape();
        this.shape_114.graphics.lf(["#EFF6F7", "#F0F6F8"], [0, 1], 6.3, 1.9, -6.1, -0.9).s().p("AhIAnQAjgSAGgQQAEgKgJgEQAPgCAjgNIA9gYQAPACgFAHIgJAJIhOAkQg8AbgXAQIANgKg");
        this.shape_114.setTransform(32.1, 70.6, 1, 1, 0, 0, 180);

        this.shape_115 = new cjs.Shape();
        this.shape_115.graphics.lf(["#ECF4F5", "#EDF5F6"], [0, 1], 6.6, 1.8, -5.9, -1.1).s().p("AhHAmQAjgSAGgUQADgKgFgGQAPAAAhgNIA/gYQAPADgGAIIgIAKQgrATglAQQhCAggXATgAgsgWQAIACAEAEIgBAAQgJAAgCgGg");
        this.shape_115.setTransform(32.3, 70.9, 1, 1, 0, 0, 180);

        this.shape_116 = new cjs.Shape();
        this.shape_116.graphics.lf(["#E9F2F4", "#EAF3F4"], [0, 1], 6.3, 2, -6.2, -0.8).s().p("AhLAqQAjgSAHgYQADgLgFgHQAQABAfgMIBBgZQAPAEgFAJIgJAKQgrATgkAQQg9AegZAVIAMgNgAgwgbQAKACADAHQgKgBgDgIg");
        this.shape_116.setTransform(32, 70.8, 1, 1, 0, 0, 180);

        this.shape_117 = new cjs.Shape();
        this.shape_117.graphics.lf(["#E7F0F2", "#E8F1F3"], [0, 1], 6.5, 2, -6.1, -0.9).s().p("AhVA2IAJgLQAkgTAHgbQACgNgDgIQAQADAegMIBDgZQAPAFgFAJIgIALQgsATglARQg/AfgaAZIAEgFgAgwgkQALAEADAIQgLgCgDgKg");
        this.shape_117.setTransform(32.1, 71, 1, 1, 0, 0, 180);

        this.shape_118 = new cjs.Shape();
        this.shape_118.graphics.lf(["#E4EFF1", "#E5EFF1"], [0, 1], 6.6, 1.9, -6.1, -1).s().p("AhWA3QAIgLACgBQAkgTAGgfQADgNgDgJQAQAEAegLIBFgaQAOAGgFAKIgIAMQgsASglASQhBAggbAdIAFgIgAgwgsQALAEADALQgLgEgDgLg");
        this.shape_118.setTransform(32.1, 71.1, 1, 1, 0, 0, 180);

        this.shape_119 = new cjs.Shape();
        this.shape_119.graphics.lf(["#E1EDEF", "#E3EEF0"], [0, 1], 6.7, 1.9, -6, -1).s().p("AhXA6IAJgOQAlgTAGgjQADgOgCgKQAQAGAegLIAogSQAWgJAIABQAPAHgGAKIgIANQgsASglARQhCAigcAgIAFgIgAgxg1QALAGAEANQgLgFgEgOg");
        this.shape_119.setTransform(32.1, 71.3, 1, 1, 0, 0, 180);

        this.shape_120 = new cjs.Shape();
        this.shape_120.graphics.lf(["#DEEBEE", "#E0ECEF"], [0, 1], 6.7, 2.1, -6.1, -0.8).s().p("AhYA9QAHgOACgBQAlgTAGgnQADgQgDgLQARAJAegLIAogSQAWgKAJABQAQAJgGALIgIANQgtASglARQhCAigdAjIAFgIgAgzg8QAMAHADAOQgKgGgFgPg");
        this.shape_120.setTransform(32.1, 71.3, 1, 1, 0, 0, 180);

        this.shape_121 = new cjs.Shape();
        this.shape_121.graphics.lf(["#DBE9EC", "#DEEBED"], [0, 1], 6.8, 2, -6.1, -0.9).s().p("AhZA/QAGgPACgBQAmgUAHgqQACgSgCgMQAQALAegLIApgSQAXgKAKABQAPAJgGAMQgCAHgGAHQgtASglATQhEAigdAnIAFgKgAg0hEQANAHADAQQgLgHgFgQg");
        this.shape_121.setTransform(32.1, 71.5, 1, 1, 0, 0, 180);

        this.shape_122 = new cjs.Shape();
        this.shape_122.graphics.lf(["#D9E8EB", "#DBE9EC"], [0, 1], 6.9, 2.1, -6, -0.9).s().p("AhaBBQAFgQADgBQAmgUAHguQACgSgCgOQARAOAegMIApgSQAXgKALABQAPAKgFANQgDAHgGAIQgtARgmATQhEAjgeArIAFgMgAg1hMQANAIADASQgLgIgFgSg");
        this.shape_122.setTransform(32.1, 71.6, 1, 1, 0, 0, 180);

        this.shape_123 = new cjs.Shape();
        this.shape_123.graphics.lf(["#D6E6E9", "#D9E7EB"], [0, 1], 6.9, 2.4, -6.1, -0.6).s().p("AhcBGQAFgRADgBQAngVAHgxQACgUgCgOQARAPAegLIApgSQAXgLAMABQAQAMgFANQgDAHgGAIQgtARgmATQhEAkggAuIAEgMgAg2hRQAMAJAEAUQgLgKgFgTg");
        this.shape_123.setTransform(32, 71.4, 1, 1, 0, 0, 180);

        this.shape_124 = new cjs.Shape();
        this.shape_124.graphics.lf(["#D3E5E8", "#D7E6EA"], [0, 1], 7, 2.6, -6.1, -0.4).s().p("AhdBLQAFgSADgCQAmgVAHg1QADgVgCgPQARASAegMQAOgFAbgNQAYgLANABQAQANgGAOQgDAHgGAJQgtAQgmATQhEAlghAyIAEgNgAg4hXQANAKAEAWQgLgLgGgVg");
        this.shape_124.setTransform(32, 71.3, 1, 1, 0, 0, 180);

        this.shape_125 = new cjs.Shape();
        this.shape_125.graphics.lf(["#D0E3E7", "#D4E5E8"], [0, 1], 7, 2.9, -6.1, -0.1).s().p("AheBQQAEgTADgCQAngWAIg5QACgXgCgQQASAVAegLQANgFAcgOQAYgMAOACQARANgGAPQgDAIgHAJQgtAQgmAUQhGAlghA2IAEgOgAg4hdQANALADAXQgKgMgGgWg");
        this.shape_125.setTransform(32, 71.2, 1, 1, 0, 0, 180);

        this.shape_126 = new cjs.Shape();
        this.shape_126.graphics.lf(["#CEE2E6", "#D2E3E7"], [0, 1], 7, 3.2, -6.3, 0.1).s().p("AhgBVQAEgVAEgBQAngWAHg9QADgZgCgRQASAYAegLQANgFAbgPQAZgMAQACQAQAPgGAPQgDAIgGAKQgtAPgnAUQhGAmgiA5IADgOgAg6hiQANALAEAZQgKgNgHgXg");
        this.shape_126.setTransform(31.9, 71.1, 1, 1, 0, 0, 180);

        this.shape_127 = new cjs.Shape();
        this.shape_127.graphics.lf(["#CBE0E4", "#CFE2E6"], [0, 1], 7.1, 3.4, -6.5, 0.3).s().p("AhhBaQADgWAEgCQAogWAIhBQACgagCgTQATAbAdgLQANgFAcgPQAZgMARACQARAQgGAQQgDAIgHAKQgtAPgnAVQhHAmgjA9IADgPgAg7hoQANAMAEAaQgKgOgHgYg");
        this.shape_127.setTransform(31.9, 71, 1, 1, 0, 0, 180);

        this.shape_128 = new cjs.Shape();
        this.shape_128.graphics.lf(["#C8DFE3", "#CDE0E5"], [0, 1], 7.1, 3.7, -6.9, 0.5).s().p("AhiBeQADgXAEgCQAogWAIhFQACgcgCgUQATAeAdgLQANgFAcgPQAagMASACQARARgGAQQgEAJgGAKQguAPgnAVQhHAngkBBIADgRgAg8huQANANAEAbQgKgPgHgZg");
        this.shape_128.setTransform(31.9, 70.9, 1, 1, 0, 0, 180);

        this.shape_129 = new cjs.Shape();
        this.shape_129.graphics.lf(["#BFD7DE", "#C3D9E0"], [0, 1], 7.3, 3.3, -6.8, 0).s().p("AhjBgQADgWAEgCQApgYAHhFQAEgfgEgWQATAcAfgNQAOgFAcgQQAagMARACQARASgGAUQgDALgJAOQguARgnAVQhIAngkA+IAEgQgAg9hvQANANAEAYQgKgOgHgXg");
        this.shape_129.setTransform(31.8, 70.9, 1, 1, 0, 0, 180);

        this.shape_130 = new cjs.Shape();
        this.shape_130.graphics.lf(["#B6D1D9", "#BAD2DA"], [0, 1], 7.4, 2.9, -6.8, -0.3).s().p("AhkBhQAEgVAEgCQAogZAHhEQAEgkgGgYQAUAbAigPQAOgGAdgQQAagMAQACQARAVgGAXQgDANgLARQgvASgnAWQhIAngjA6IAEgPgAg9hwQAKANAEAUQgIgMgGgVg");
        this.shape_130.setTransform(31.6, 71, 1, 1, 0, 0, 180);

        this.shape_131 = new cjs.Shape();
        this.shape_131.graphics.lf(["#AECAD4", "#B1CBD5"], [0, 1], 7.6, 2.3, -6.7, -1).s().p("AhlBhQAFgUADgCQApgaAHhEQAEgogHgaQATAZAlgQQAPgGAdgRQAagNAPACQASAYgGAaQgDALgOAZQgvAUgoAVQhIAogiA3IAEgPg");
        this.shape_131.setTransform(31.5, 71.1, 1, 1, 0, 0, 180);

        this.shape_132 = new cjs.Shape();
        this.shape_132.graphics.lf(["#A5C4CF", "#A8C5D0"], [0, 1], 7.6, 2.3, -6.7, -1).s().p("AhmBmQAFgTADgCQApgcAHhDQAFgrgJgdQATAYAogSQAPgHAegRQAagNAOACQASAagGAdQgEASgPAYQgvAUgoAWQhJApghAzIAEgOg");
        this.shape_132.setTransform(31.4, 70.8, 1, 1, 0, 0, 180);

        this.shape_133 = new cjs.Shape();
        this.shape_133.graphics.lf(["#9DBECB", "#A0BFCC"], [0, 1], 7.8, 2.3, -6.6, -1).s().p("AhnBsQAGgTADgBQApgeAHhDQAEgugLggQATAYAsgVQAPgHAfgSQAagNANABQAgAzgpA6QgwAVgnAXQhLAqggAwIAFgOg");
        this.shape_133.setTransform(31.3, 70.4, 1, 1, 0, 0, 180);

        this.shape_134 = new cjs.Shape();
        this.shape_134.graphics.lf(["#95B8C6", "#98B9C7"], [0, 1], 7.9, 2.3, -6.6, -1).s().p("AhoBxQAHgSADgBQApgfAHhDQAFgxgNgjQASAXAvgXQAQgHAggTQAagNALABQATAfgGAjQgFAcgTAaQgwAWgoAXQhLArgfAtIAFgOg");
        this.shape_134.setTransform(31.2, 70.1, 1, 1, 0, 0, 180);

        this.shape_135 = new cjs.Shape();
        this.shape_135.graphics.lf(["#8DB2C2", "#90B3C3"], [0, 1], 8.1, 2.4, -6.5, -0.9).s().p("AhpB4QAHgSADgBQApggAHhEQAFg0gPglQASAXAygaQARgIAggSQAbgOAKABQATAigGAmQgFAggWAaQgwAZgoAXQhKAqgfApIAFgLg");
        this.shape_135.setTransform(31, 69.6, 1, 1, 0, 0, 180);

        this.shape_136 = new cjs.Shape();
        this.shape_136.graphics.lf(["#86ADBE", "#88AEBF"], [0, 1], 8.2, 2.4, -6.5, -1).s().p("AhqB9QAIgRACgBQApghAHhEQAGg2gSgoQARAWA3gdIAygcQAagOAJABQAUAlgGApQgFAkgYAcIhZAyQhLArgeAmIAGgMg");
        this.shape_136.setTransform(30.9, 69.3, 1, 1, 0, 0, 180);

        this.shape_137 = new cjs.Shape();
        this.shape_137.graphics.lf(["#7EA8BA", "#80A8BB"], [0, 1], 8.3, 2.4, -6.5, -1).s().p("AhrCCQAJgPACgBQApgjAHhEQAFg4gSgrQAPAUA7geQBSgrAEAAQAUAogGArQgGAogaAeIhZAzQhMAsgdAjIAGgMg");
        this.shape_137.setTransform(30.8, 68.9, 1, 1, 0, 0, 180);

        this.shape_138 = new cjs.Shape();
        this.shape_138.graphics.lf(["#76A3B6", "#78A3B7"], [0, 1], 8.5, 2.5, -6.5, -1).s().p("AhsCIQAJgPACAAQApgkAHhEQAFg5gTguQAMATBAgiQBTgtADABQAUArgFAtQgGAsgcAgIhbA1QhLArgcAfIAGgKg");
        this.shape_138.setTransform(30.6, 68.5, 1, 1, 0, 0, 180);

        this.shape_139 = new cjs.Shape();
        this.shape_139.graphics.lf(["#6F9EB2", "#709FB3"], [0, 1], 8.6, 2.4, -6.4, -1.1).s().p("AhsCNIALgOQApgmAHhDQAGg6gVgxQALARBEgmQBTguADABQAVAugGAwQgGAwgeAhQgEAEhXAzQhOAtgbAcIAIgLg");
        this.shape_139.setTransform(30.6, 68.2, 1, 1, 0, 0, 180);

        this.shape_140 = new cjs.Shape();
        this.shape_140.graphics.lf(["#679AAF", "#689AAF"], [0, 1], 8.8, 2.4, -6.3, -1.1).s().p("AhtCSQAKgNACgBQApgnAHhDQAGg6gWg1QAJAPBIgoQBUgvACAAQAVAxgGAzQgGAzggAkQgHAGhVAyQhQAvgZAZIAJgMg");
        this.shape_140.setTransform(30.5, 67.9, 1, 1, 0, 0, 180);

        this.shape_141 = new cjs.Shape();
        this.shape_141.graphics.lf(["#5F95AB", "#6095AB"], [0, 1], 8.9, 2.4, -6.3, -1.1).s().p("AhiCMQApgpAHhDQAGg7gWg3QAHAMBLgsQBVgwACABQAVA0gGA1QgGA3gjAmQgIAIhUAyQhQAugYAWIAVgXg");
        this.shape_141.setTransform(30.3, 67.4, 1, 1, 0, 0, 180);

        this.shape_142 = new cjs.Shape();
        this.shape_142.graphics.lf(["#5791A8", "#5891A8"], [0, 1], 9.1, 2.4, -6.2, -1.1).s().p("AhiCSQApgqAHhDQAGg6gWg6QAEAIBQguIBXgyQAVA4gGA3QgGA6glApQgLAKhSAxQhTAxgWARIAXgWg");
        this.shape_142.setTransform(30.3, 67.1, 1, 1, 0, 0, 180);

        this.shape_143 = new cjs.Shape();
        this.shape_143.graphics.lf(["#4F8DA4", "#4F8DA4"], [0, 1], 9.3, 2.3, -6.1, -1.2).s().p("AhiCYQApgsAHhCQAGg7gWg8QABAEBUgxIBYgyQAWA6gGA5QgHA+gnAqQgMANhSAxQhcA2gOAKg");
        this.shape_143.setTransform(30.2, 66.8, 1, 1, 0, 0, 180);

        this.shape_144 = new cjs.Shape();
        this.shape_144.graphics.f("#4689A1").s().p("AhiCeQApgsAHhCQAGg7gWg/ICuhnQAWA+gGA7QgHBBgpAtQgOAOhQAxIhqA9g");
        this.shape_144.setTransform(30.1, 66.4, 1, 1, 0, 0, 180);

        this.shape_145 = new cjs.Shape();
        this.shape_145.graphics.f("#AFB9C7").s().p("AgvAgQgkgDgHgPQgJgRALgNQAMgNAegCQAfgCA3APQA3APAAAIQAAAJgWAHQgXAIgfACIgvACIgTgBg");
        this.shape_145.setTransform(43.4, 82.8, 1, 1, 0, 0, 180);

        this.shape_146 = new cjs.Shape();
        this.shape_146.graphics.f("#B1BCC9").s().p("Ag2AgQgkgEgHgQQgIgRAOgMQAPgOAhgCQAigCA3AQQA2APAAAIQAAAKgZAIQgaAIgiACIgnACIgegCg");
        this.shape_146.setTransform(43.2, 82.8, 1, 1, 0, 0, 180);

        this.shape_147 = new cjs.Shape();
        this.shape_147.graphics.f("#B3BECB").s().p("AhnAMQgHgSARgNQARgNAlgCQAkgBA3APQA2AOAAAKQAAAKgcAJQgdAJgmACIgdABQhMAAgJgXg");
        this.shape_147.setTransform(43.1, 82.7, 1, 1, 0, 0, 180);

        this.shape_148 = new cjs.Shape();
        this.shape_148.graphics.f("#B6C0CD").s().p("AhtALQgHgSATgNQAVgNAngCQAngBA3APQA3APAAAKQAAAKggAKQghAKgoABIgYABQhSAAgKgZg");
        this.shape_148.setTransform(42.9, 82.6, 1, 1, 0, 0, 180);

        this.shape_149 = new cjs.Shape();
        this.shape_149.graphics.f("#B8C2CF").s().p("AhzAKQgGgSAWgNQAXgNArgCQApgBA4APQA2AOAAALQAAAMgkAKQgjAKgsACIgXAAQhWAAgJgbg");
        this.shape_149.setTransform(42.7, 82.5, 1, 1, 0, 0, 180);

        this.shape_150 = new cjs.Shape();
        this.shape_150.graphics.f("#BBC4D1").s().p("Ah6AIQgFgRAZgNQAagOAugBQAsgCA3APQA2APAAALQAAANgmALQgnALguABIgUAAQhcAAgKgeg");
        this.shape_150.setTransform(42.5, 82.4, 1, 1, 0, 0, 180);

        this.shape_151 = new cjs.Shape();
        this.shape_151.graphics.f("#BDC6D3").s().p("AhXAhQgjgIgFgSQgFgRAcgOQAcgNAxgBQAwgCA3APQA1APAAAMQAAANgpAMQgqALgxACIgMAAQgsAAgcgHg");
        this.shape_151.setTransform(42.4, 82.3, 1, 1, 0, 0, 180);

        this.shape_152 = new cjs.Shape();
        this.shape_152.graphics.f("#BFC9D5").s().p("AheAhQgjgJgEgSQgFgSAfgNQAfgOA1gBQAzgBA2APQA1AOAAANQAAAOgtAMQgsANg0ABIgMAAQguAAgegIg");
        this.shape_152.setTransform(42.3, 82.3, 1, 1, 0, 0, 180);

        this.shape_153 = new cjs.Shape();
        this.shape_153.graphics.f("#C2CBD7").s().p("AhlAiQgjgKgEgTQgEgSAigNQAigOA3gBQA2gBA2APQA2AOAAAOQAAAOgwANQgwANg3ABIgLAAQgxAAgfgIg");
        this.shape_153.setTransform(42.1, 82.2, 1, 1, 0, 0, 180);

        this.shape_154 = new cjs.Shape();
        this.shape_154.graphics.f("#C4CDDA").s().p("AhrAhQgjgKgEgTQgDgSAkgOQAlgOA7gBQA5AAA2AOQA1AOAAAPQAAAPg0AOQgzAOg6AAIgJABQg0AAgggLg");
        this.shape_154.setTransform(41.9, 82.1, 1, 1, 0, 0, 180);

        this.shape_155 = new cjs.Shape();
        this.shape_155.graphics.f("#C7D0DC").s().p("AhyAiQgjgMgDgTQgDgSAogOQAogOA9gBQA8AAA2AOQA1AOAAAQQAAAPg3APQg2AOg9ABIgFAAQg5AAgjgLg");
        this.shape_155.setTransform(41.8, 82, 1, 1, 0, 0, 180);

        this.shape_156 = new cjs.Shape();
        this.shape_156.graphics.f("#C9D2DE").s().p("Ah5AiQgigMgDgVQgCgRAqgOQArgOBAgBQA/AAA2AOQA1AOAAAQQAAAQg6AQQg6APhAAAIgEAAQg8AAgkgMg");
        this.shape_156.setTransform(41.6, 82, 1, 1, 0, 0, 180);

        this.shape_157 = new cjs.Shape();
        this.shape_157.graphics.f("#CCD4E0").s().p("Ah/AiQgigNgDgVQgCgSAugOQAtgOBEAAQBCgBA1APQA1AOAAARQAAARg9APQg9AQhEAAIgEAAQg+AAgkgNg");
        this.shape_157.setTransform(41.5, 81.9, 1, 1, 0, 0, 180);

        this.shape_158 = new cjs.Shape();
        this.shape_158.graphics.f("#CED7E2").s().p("AiFAiQgjgOgCgUQgBgTAwgOQAwgOBHgBQBFAAA1AOQA1AOAAASQAAARhBARQhAAQhGABIgEAAQhAAAglgPg");
        this.shape_158.setTransform(41.3, 81.8, 1, 1, 0, 0, 180);

        this.shape_159 = new cjs.Shape();
        this.shape_159.graphics.f("#D1D9E5").s().p("AiMAiQgigOgCgVQAAgUAygOQA0gOBJAAQBIAAA2AOQA0AOAAATQAAARhEASQhDARhKAAQhFAAgngQg");
        this.shape_159.setTransform(41.2, 81.7, 1, 1, 0, 0, 180);

        this.shape_160 = new cjs.Shape();
        this.shape_160.graphics.f("#D4DCE7").s().p("AiTAiQgigPAAgVQgBgUA2gOQA2gOBMAAQBMgBA0APQA1ANAAAUQAAAShIASQhGAShMAAQhIAAgogRg");
        this.shape_160.setTransform(41, 81.7, 1, 1, 0, 0, 180);

        this.shape_161 = new cjs.Shape();
        this.shape_161.graphics.f("#D6DEE9").s().p("AiaAiQghgQAAgVQAAgVA4gOQA5gOBPAAQBPAAA1AOQA0AOAAAVQAAAShLATQhKAShPAAQhKAAgpgSg");
        this.shape_161.setTransform(40.9, 81.6, 1, 1, 0, 0, 180);

        this.shape_162 = new cjs.Shape();
        this.shape_162.graphics.f("#D8DFEA").s().p("AiWAkQgpgRAAgWQAAgUA6gQQA6gOBRAAQBQAAA2AOQA0APAAAUQAAAUhFAUQhGAShQABQhNgBgugSg");
        this.shape_162.setTransform(40.8, 81.6, 1, 1, 0, 0, 180);

        this.shape_163 = new cjs.Shape();
        this.shape_163.graphics.f("#D9E0EB").s().p("AiSAlQgwgRAAgWQAAgVA7gQQA9gQBQAAQBRgBA3ARQA1APAAAVQAAAUhAAUQhCAThQAAQhPABg0gUg");
        this.shape_163.setTransform(40.7, 81.5, 1, 1, 0, 0, 180);

        this.shape_164 = new cjs.Shape();
        this.shape_164.graphics.f("#DBE1EC").s().p("AiPAnQg3gSAAgWQAAgWA9gRQA+gSBSAAQBSABA4AQQA2ARAAAVQAAAWg8ATQg+AVhRgBQhRABg6gUg");
        this.shape_164.setTransform(40.6, 81.5, 1, 1, 0, 0, 180);

        this.shape_165 = new cjs.Shape();
        this.shape_165.graphics.f("#DDE2EC").s().p("AiMApQg9gUAAgVQAAgWA+gTQBAgTBSAAQBTAAA5ASQA3ARAAAXQAAAWg3ATQg7AWhRAAQhSgBhBgTg");
        this.shape_165.setTransform(40.6, 81.4, 1, 1, 0, 0, 180);

        this.shape_166 = new cjs.Shape();
        this.shape_166.graphics.f("#DEE3ED").s().p("AiIAqQhEgTAAgXQAAgWA/gTQBCgVBTABQBUAAA6ASQA3ASAAAXQAAAXgxAUQg3AVhSAAQhVABhGgVg");
        this.shape_166.setTransform(40.5, 81.4, 1, 1, 0, 0, 180);

        this.shape_167 = new cjs.Shape();
        this.shape_167.graphics.f("#E0E4EE").s().p("AiEAsQhMgUAAgXQAAgXBBgVQBDgUBVAAQBVAAA7ATQA4ATAAAYQAAAYgtAUQgzAVhSAAQhXABhMgVg");
        this.shape_167.setTransform(40.4, 81.3, 1, 1, 0, 0, 180);

        this.shape_168 = new cjs.Shape();
        this.shape_168.graphics.f("#E1E6EF").s().p("AiBAtQhSgVAAgWQAAgYBCgVQBEgXBWABQBWgBA8AVQA5ATAAAYQAAAagoATQgvAYhTAAQhYAAhTgWg");
        this.shape_168.setTransform(40.4, 81.3, 1, 1, 0, 0, 180);

        this.shape_169 = new cjs.Shape();
        this.shape_169.graphics.f("#E3E7EF").s().p("Ah9AvQhZgWAAgXQAAgYBDgWQBGgXBXgBQBXABA9AVQA5AUAAAZQAAAbgjATQgrAXhTAAQhbAAhYgVg");
        this.shape_169.setTransform(40.3, 81.2, 1, 1, 0, 0, 180);

        this.shape_170 = new cjs.Shape();
        this.shape_170.graphics.f("#E5E8F0").s().p("Ah6AxQhggWAAgYQAAgZBFgXQBIgZBYAAQBYABA+AWQA6AVAAAZQAAAdgeASQgnAYhUAAQheABhegWg");
        this.shape_170.setTransform(40.2, 81.2, 1, 1, 0, 0, 180);

        this.shape_171 = new cjs.Shape();
        this.shape_171.graphics.f("#E7E9F1").s().p("Ah3AyQhmgWAAgZQAAgZBFgXQBKgaBZAAQBaAAA/AXQA6AVAAAbQAABJiRAAQhfAAhlgXg");
        this.shape_171.setTransform(40.2, 81.1, 1, 1, 0, 0, 180);

        this.shape_172 = new cjs.Shape();
        this.shape_172.graphics.f("#E8EAF2").s().p("AhzA0QhugYAAgYQABgZBGgZQBLgbBbAAQBaAABAAYQA8AWAAAbQgBAhgUAQQgfAZhVAAQhhAAhrgWg");
        this.shape_172.setTransform(40.1, 81.1, 1, 1, 0, 0, 180);

        this.shape_173 = new cjs.Shape();
        this.shape_173.graphics.f("#EAEBF3").s().p("AhvA1Qh1gXAAgZQAAgaBIgaQBNgcBbAAQBcAABBAZQA8AXAAAbQAAAkgQAPQgbAZhVAAQhlAAhvgXg");
        this.shape_173.setTransform(40, 81, 1, 1, 0, 0, 180);

        this.shape_174 = new cjs.Shape();
        this.shape_174.graphics.f("#EBECF4").s().p("AhsA3Qh7gYAAgZQAAgbBJgbQBOgdBdAAQBdAABCAaQA8AYAAAbQAAAogKAMQgYAahVAAQhoAAh1gXg");
        this.shape_174.setTransform(39.9, 81, 1, 1, 0, 0, 180);

        this.shape_175 = new cjs.Shape();
        this.shape_175.graphics.f("#EDEDF5").s().p("AhpA5QiCgZAAgZQAAgbBKgdQBQgeBeAAQBeAABDAbQA9AYAAAcIABAbQAAAQgHAKQgTAbhWAAQhqAAh7gXg");
        this.shape_175.setTransform(39.8, 80.9, 1, 1, 0, 0, 180);

        this.shape_176 = new cjs.Shape();
        this.shape_176.graphics.f("#EFEEF6").s().p("AhmA6QiJgZAAgaQAAgbBMgeQBRgfBeAAQBfAABEAcQA+AZAAAcQAAAJADATQACARgGAKQgPAbhWAAQhtAAiAgYg");
        this.shape_176.setTransform(39.6, 80.9, 1, 1, 0, 0, 180);

        this.shape_177 = new cjs.Shape();
        this.shape_177.graphics.f("#F0F0F7").s().p("AhkA8QiQgbAAgZQAAgcBNgfQBTggBfAAQBgAABFAdQA/AaAAAcQAAAFAEAYQAEARgEAKQgLAchXAAQhuAAiHgYg");
        this.shape_177.setTransform(39.4, 80.9, 1, 1, 0, 0, 180);

        this.shape_178 = new cjs.Shape();
        this.shape_178.graphics.f("#F0F0F7").s().p("ABlB5Qh7gCh0gWQh5gXgdgcQgagagEgQQgCgGADgWQACgNgXgFQgdgDgLgDQgNgEAJgdIAKgcIA1gLIIOASQCnAfAKAOQAIAKgTAWQgTAUgeARQgSALglAMQghAKgTANQgSANAHAeQgHAUhSAAIgQAAg");
        this.shape_178.setTransform(35, 77.4, 1, 1, 0, 0, 180);

        this.shape_179 = new cjs.Shape();
        this.shape_179.graphics.f("#F1F0F7").s().p("ABkB7Qh6gDh3gWQh6gYgcgcQgbgbgGgPQgEgJADgTQACgOgWgGQgcgEgJgEQgMgEAIgbIALgbIA1gMIIRAPQCrAfAKAOQAIAKgUAXQgUAYgeAQQgSALglAMQghALgTAOQgRAMAEAeQgIAWhTAAIgPAAg");
        this.shape_179.setTransform(34.7, 77.6, 1, 1, 0, 0, 180);

        this.shape_180 = new cjs.Shape();
        this.shape_180.graphics.f("#F2F1F8").s().p("ABjB9Qh6gDh4gXQh7gYgdgdQgcgcgIgOQgGgMADgRQACgNgVgHQgZgGgJgEQgLgEAJgaIAKgaIA3gNIIUAMQCtAfALAOQAIAKgWAZQgVAagdAQQgSALglANQggAMgTANQgLAIgBAOIgDAWQgKAWhTAAIgPAAg");
        this.shape_180.setTransform(34.5, 77.8, 1, 1, 0, 0, 180);

        this.shape_181 = new cjs.Shape();
        this.shape_181.graphics.f("#F2F2F8").s().p("ABiB+Qh6gCh5gYQh9gZgcgdQgfgegIgNQgIgNACgQQACgNgTgIQgXgHgIgEQgKgFAIgZIALgYIA3gOIIXAJQCxAeAKAOQAIAKgWAcQgWAcgdAQQgSAKglAOQggAMgTAOQgLAIgBAOQgDATgBAEQgMAXhTAAIgPgBg");
        this.shape_181.setTransform(34.2, 78, 1, 1, 0, 0, 180);

        this.shape_182 = new cjs.Shape();
        this.shape_182.graphics.f("#F3F3F8").s().p("ABhCAQh5gCh7gZQh+gagdgdQghghgIgKQgLgOADgPQACgNgSgKQgWgIgHgEQgJgFAJgYIAKgWIA5gPIIaAGIBbAQQBdATAGAIQAIAKgXAeQgXAegeARQgRAKglAOQgfANgUAOQgKAHgDAPQgDATgCAEQgMAXhVAAIgOAAg");
        this.shape_182.setTransform(34, 78.1, 1, 1, 0, 0, 180);

        this.shape_183 = new cjs.Shape();
        this.shape_183.graphics.f("#F4F3F9").s().p("ABhCCQh5gDh9gaQh/gagdgdIgrgrQgOgPADgPQACgNgRgLQgUgJgGgEQgIgGAJgWIAKgVIA6gQIIdADIBdAQQBeASAGAIQAIALgYAgQgYAggdAQQgRAKglAQQggANgTAOQgKAHgDAPQgEATgDAFQgOAYhVAAIgNAAg");
        this.shape_183.setTransform(33.8, 78.3, 1, 1, 0, 0, 180);

        this.shape_184 = new cjs.Shape();
        this.shape_184.graphics.f("#F5F4F9").s().p("ABgCEQh4gDh/gaQiAgbgdgdIgugsQgQgQACgOQACgOgPgLQgSgLgGgEQgHgGAJgVIALgUIA6gRIIhAAIBeAQQBgASAGAIQAIALgZAiQgaAjgdAQQgQAJglARQgfAOgUAOQgKAHgEAPQgEATgDAFQgQAZhVAAIgNAAg");
        this.shape_184.setTransform(33.5, 78.5, 1, 1, 0, 0, 180);

        this.shape_185 = new cjs.Shape();
        this.shape_185.graphics.f("#F6F5FA").s().p("ABfCHQh4gDiBgbQiBgcgdgdIgwgsQgSgRACgNQACgOgOgMIgVgRQgGgGAJgUIAKgSIA8gSIIjgDIBgAPQBiASAGAIQAIALgaAkQgbAlgdAQQgPAJgmASQgfAOgUAOQgKAHgEAQQgFATgDAFQgSAahWAAIgMAAg");
        this.shape_185.setTransform(33.3, 78.5, 1, 1, 0, 0, 180);

        this.shape_186 = new cjs.Shape();
        this.shape_186.graphics.f("#F6F6FA").s().p("ABeCKQh3gCiDgdQiCgcgegdIgygtQgVgRACgNQACgOgMgNQgPgNgEgGQgEgGAJgSIAKgRIA8gTIIngHQDAAcALAOQAIAKgcAnQgbAngdAQQgOAIgnATQgeAPgUAOQgKAIgFAPQgGAUgEAFQgSAbhXAAIgMgBg");
        this.shape_186.setTransform(33, 78.5, 1, 1, 0, 0, 180);

        this.shape_187 = new cjs.Shape();
        this.shape_187.graphics.f("#F7F7FB").s().p("ABdCOQh3gDiEgdQiDgdgegdQgJgJgsgkQgYgSACgNQACgOgKgOQgNgPgDgFQgEgHAJgRIAKgQIA+gTIIpgKQDEAcAKANQAIALgcAoQgdApgcAQQgOAJgnAUQgeAPgUAOQgKAHgFAQQgHAUgEAGQgUAbhXAAIgMAAg");
        this.shape_187.setTransform(32.8, 78.5, 1, 1, 0, 0, 180);

        this.shape_188 = new cjs.Shape();
        this.shape_188.graphics.f("#F8F8FB").s().p("ABcCRQh2gDiGgeQiEgdgegeQgMgMgsghQgagTACgNQACgNgJgQQgLgPgDgGQgCgHAJgQIAKgOIA/gVIItgMQDGAbALANQAIALgeArQgeArgcAQIg1AdQgdAPgUAPQgKAHgGAQQgHAUgFAGQgVAchYAAIgMAAg");
        this.shape_188.setTransform(32.6, 78.6, 1, 1, 0, 0, 180);

        this.shape_189 = new cjs.Shape();
        this.shape_189.graphics.f("#F9F9FC").s().p("ABcCUQh2gCiIgfQiFgegegeQgOgOgsggQgdgTACgMQACgNgIgSQgJgRgCgGQgBgHAJgOIAKgNIBAgWIIwgPQDKAaAKAOQAIALgeAsQgfAugdAQIg0AdQgcAQgWAPQgKAHgGAQQgIAUgFAHQgXAchYAAIgLAAg");
        this.shape_189.setTransform(32.4, 78.6, 1, 1, 0, 0, 180);

        this.shape_190 = new cjs.Shape();
        this.shape_190.graphics.f("#FAFAFC").s().p("ABbCXQh1gCiKggQiHgfgegeQgPgPgtgfQgfgTACgNQACgNgHgSIgIgZQgBgIAKgMIAKgMIBAgWIIzgTQDNAaALAOQAIALggAuQggAwgcAQIg0AeQgbAQgWAQQgKAHgHAQQgJAUgFAHQgZAehYAAIgLgBg");
        this.shape_190.setTransform(32.1, 78.6, 1, 1, 0, 0, 180);

        this.shape_191 = new cjs.Shape();
        this.shape_191.graphics.f("#FBFBFD").s().p("ABaCbQh1gDiLggQiHgggfgeQgQgQgvgeQghgVABgMQACgMgFgUQgFgWAAgEQAAgIAKgMIAKgKIBBgXII2gWQDRAaAKANQAIALggAxQghAygdAQQhEAnghAYQgJAHgIAQQgJAVgGAHQgaAehYAAIgMAAg");
        this.shape_191.setTransform(31.9, 78.6, 1, 1, 0, 0, 180);

        this.shape_192 = new cjs.Shape();
        this.shape_192.graphics.f("#FCFCFE").s().p("ABaCeQh1gCiMghQiJghgfgeQgRgRgxgeQgkgVACgLQACgMgEgWQgDgVABgGQABgJAKgKIAKgJIBCgYII5gZQDUAZAKAOQAIALghAzQgiA0gdAPQg/AmglAbQgKAHgIARQgJAUgHAIQgbAehZAAIgLAAg");
        this.shape_192.setTransform(31.7, 78.6, 1, 1, 0, 0, 180);

        this.shape_193 = new cjs.Shape();
        this.shape_193.graphics.f("#FEFEFE").s().p("ABZChQh0gCiOgiQiKghgfgfQgRgRgzgeQgngVACgMQACgLgCgXQgCgWACgHQACgJAKgJIAKgHIBDgaII8gcQDXAZAKAOQAIALgiA1QgjA2gcAQQgrAYg5ApQgKAHgIASQgLAUgHAIQgcAghZAAIgMgBg");
        this.shape_193.setTransform(31.5, 78.7, 1, 1, 0, 0, 180);

        this.shape_194 = new cjs.Shape();
        this.shape_194.graphics.f("#FFFFFF").s().p("ABaClQh0gDiPgjQiMghgegfQgSgRg1geQgpgWACgMQABgJAAgaQgBgXADgIQADgJALgIIAJgFIBFgbII/gfQDaAZAKANQAIALgjA3QgkA5gdAQQgcAQhHAyQgJAHgKASQgKAVgIAIQgfAghZAAIgLAAg");
        this.shape_194.setTransform(31.5, 78.7, 1, 1, 0, 0, 180);

        this.timeline.addTween(cjs.Tween.get({}).to({ state: [{ t: this.shape_194 }, { t: this.shape_193 }, { t: this.shape_192 }, { t: this.shape_191 }, { t: this.shape_190 }, { t: this.shape_189 }, { t: this.shape_188 }, { t: this.shape_187 }, { t: this.shape_186 }, { t: this.shape_185 }, { t: this.shape_184 }, { t: this.shape_183 }, { t: this.shape_182 }, { t: this.shape_181 }, { t: this.shape_180 }, { t: this.shape_179 }, { t: this.shape_178 }, { t: this.shape_177 }, { t: this.shape_176 }, { t: this.shape_175 }, { t: this.shape_174 }, { t: this.shape_173 }, { t: this.shape_172 }, { t: this.shape_171 }, { t: this.shape_170 }, { t: this.shape_169 }, { t: this.shape_168 }, { t: this.shape_167 }, { t: this.shape_166 }, { t: this.shape_165 }, { t: this.shape_164 }, { t: this.shape_163 }, { t: this.shape_162 }, { t: this.shape_161 }, { t: this.shape_160 }, { t: this.shape_159 }, { t: this.shape_158 }, { t: this.shape_157 }, { t: this.shape_156 }, { t: this.shape_155 }, { t: this.shape_154 }, { t: this.shape_153 }, { t: this.shape_152 }, { t: this.shape_151 }, { t: this.shape_150 }, { t: this.shape_149 }, { t: this.shape_148 }, { t: this.shape_147 }, { t: this.shape_146 }, { t: this.shape_145 }, { t: this.shape_144 }, { t: this.shape_143 }, { t: this.shape_142 }, { t: this.shape_141 }, { t: this.shape_140 }, { t: this.shape_139 }, { t: this.shape_138 }, { t: this.shape_137 }, { t: this.shape_136 }, { t: this.shape_135 }, { t: this.shape_134 }, { t: this.shape_133 }, { t: this.shape_132 }, { t: this.shape_131 }, { t: this.shape_130 }, { t: this.shape_129 }, { t: this.shape_128 }, { t: this.shape_127 }, { t: this.shape_126 }, { t: this.shape_125 }, { t: this.shape_124 }, { t: this.shape_123 }, { t: this.shape_122 }, { t: this.shape_121 }, { t: this.shape_120 }, { t: this.shape_119 }, { t: this.shape_118 }, { t: this.shape_117 }, { t: this.shape_116 }, { t: this.shape_115 }, { t: this.shape_114 }, { t: this.shape_113 }, { t: this.shape_112 }, { t: this.shape_111 }, { t: this.shape_110 }, { t: this.shape_109 }, { t: this.shape_108 }, { t: this.shape_107 }, { t: this.shape_106 }, { t: this.shape_105 }, { t: this.shape_104 }, { t: this.shape_103 }, { t: this.shape_102 }, { t: this.shape_101 }, { t: this.shape_100 }, { t: this.shape_99 }, { t: this.shape_98 }, { t: this.shape_97 }, { t: this.shape_96 }, { t: this.shape_95 }, { t: this.shape_94 }, { t: this.shape_93 }, { t: this.shape_92 }, { t: this.shape_91 }, { t: this.shape_90 }, { t: this.shape_89 }, { t: this.shape_88 }, { t: this.shape_87 }, { t: this.shape_86 }, { t: this.shape_85 }, { t: this.shape_84 }, { t: this.shape_83 }, { t: this.shape_82 }, { t: this.shape_81 }, { t: this.shape_80 }, { t: this.shape_79 }, { t: this.shape_78 }, { t: this.shape_77 }, { t: this.shape_76 }, { t: this.shape_75 }, { t: this.shape_74 }, { t: this.shape_73 }, { t: this.shape_72 }, { t: this.shape_71 }, { t: this.shape_70 }, { t: this.shape_69 }, { t: this.shape_68 }, { t: this.shape_67 }, { t: this.shape_66 }, { t: this.shape_65 }, { t: this.shape_64 }, { t: this.shape_63 }, { t: this.shape_62 }, { t: this.shape_61 }, { t: this.shape_60 }, { t: this.shape_59 }, { t: this.shape_58 }, { t: this.shape_57 }, { t: this.shape_56 }, { t: this.shape_55 }, { t: this.shape_54 }, { t: this.shape_53 }, { t: this.shape_52 }, { t: this.shape_51 }, { t: this.shape_50 }, { t: this.shape_49 }, { t: this.shape_48 }, { t: this.shape_47 }, { t: this.shape_46 }, { t: this.shape_45 }, { t: this.shape_44 }, { t: this.shape_43 }, { t: this.shape_42 }, { t: this.shape_41 }, { t: this.shape_40 }, { t: this.shape_39 }, { t: this.shape_38 }, { t: this.shape_37 }, { t: this.shape_36 }, { t: this.shape_35 }, { t: this.shape_34 }, { t: this.shape_33 }, { t: this.shape_32 }, { t: this.shape_31 }, { t: this.shape_30 }, { t: this.shape_29 }, { t: this.shape_28 }, { t: this.shape_27 }, { t: this.shape_26 }, { t: this.shape_25 }, { t: this.shape_24 }, { t: this.shape_23 }, { t: this.shape_22 }, { t: this.shape_21 }, { t: this.shape_20 }, { t: this.shape_19 }, { t: this.shape_18 }, { t: this.shape_17 }, { t: this.shape_16 }, { t: this.shape_15 }, { t: this.shape_14 }, { t: this.shape_13 }, { t: this.shape_12 }, { t: this.shape_11 }, { t: this.shape_10 }, { t: this.shape_9 }, { t: this.shape_8 }, { t: this.shape_7 }, { t: this.shape_6 }, { t: this.shape_5 }, { t: this.shape_4 }, { t: this.shape_3 }, { t: this.shape_2 }, { t: this.shape_1 }, { t: this.shape }] }).wait(1));

    }).prototype = this.getMCSymbolPrototype(lib.whistleICON_MC, new cjs.Rectangle(-14.1, 32.4, 90.7, 62.8), null);


    // stage content:
    (lib.getExportRoot = function (mode, startPosition, loop) {
        this.initialize(mode, startPosition, loop, { "in": 0, out: 20 });

        var xPos = 470;

        // Whistle
        this.instance = new lib.whistleICON_MC();
        this.instance.parent = this;
        this.instance.setTransform(xPos, 83.3, 1, 1, 14.4, 0, 0, 41.1, 46);
        this.instance.alpha = 0;
        this.instance._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance)
            .wait(11).to({ _off: false }, 0)
            .to({ regX: 41, rotation: 0, x: xPos, y: 62.2, alpha: 1 }, 3)
            .to({ y: 73.2 }, 2)
            //.wait(5)
            //.to({ y: 62.2 }, 2)
            //.to({ rotation: 15, x: 432.1, y: 83.2, alpha: 0 }, 3)
            //.wait(9)
        );

        var bb = new AnimationWithWhiteStrip(lib, img, cjs, lib.txt);
        bb.showAnimatedText(this, lib.txt);

        CommonAnimationBase.call(this, lib, img, cjs, txt);
        this.initializeFrameHandler(this);

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = null;
    // library properties:
    lib.txt = txt;
    lib.properties = {
        width: 666,
        height: 250,
        fps: 24,
        color: "#FFFFFF",
        opacity: 1.00,
        webfonts: {},
        manifest: [],
        preloads: []
    };

}
CommonAnimation_Foul.prototype = Object.create(CommonAnimationBase.prototype);
CommonAnimation_Foul.prototype.constructor = CommonAnimationBase;

// Common technical problems event with white stripe
var CommonAnimation_TechnicalProblems = function (lib, img, cjs, txt) {

    CommonAnimationBase.call(this, lib, img, cjs, txt);

    (lib.Blend = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});

        // Layer 1
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#8B9AA9").s().p("Ag/A6QgJg6AWgiQATgdAZAEQALACAhAqQAiAqgHAFQgqAdg1AAQgQAAgRgDg");
        this.shape.setTransform(22.9,29.4);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.f("#909EAD").s().p("AhHA9QgTg7AhglQAdggAgAFQAPACAiArQAhApgJAFQg6Ajg5AAQgRAAgQgDg");
        this.shape_1.setTransform(23.7,29.3);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#94A3B1").s().p("AhQA/Qgdg8AtgnQAngjApAGQASACAhArQAhApgKAFQhMApg8AAQgSAAgQgEg");
        this.shape_2.setTransform(24.6,29.2);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#99A7B5").s().p("AhZBCQgng+A5gqQAwgkAyAHQAWACAhAqQAhApgNAGQgyAYgmALQgkAKggAAQgSAAgRgDg");
        this.shape_3.setTransform(25.4,29);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#9EABB9").s().p("AhiBEQgwhABEgrQA6gmA6AGQAaAEAgApQAhAogPAHQg/AcglALQgpAMgiAAQgTAAgSgEg");
        this.shape_4.setTransform(26.3,28.9);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#A2AFBD").s().p("AhqBHQg7hCBQguQAegRApgKQAlgIAaADQAeADAgApQAgAogRAHQhJAggmALQgvAOglAAQgUAAgRgEg");
        this.shape_5.setTransform(27.1,28.8);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.f("#A7B3C1").s().p("AhzBJQhEhEBbgvQAigTAvgKQArgIAdADQAhADAgApQAgAngUAIQhcAmgfAJQg0AQgnAAQgVAAgSgFg");
        this.shape_6.setTransform(27.9,28.7);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.f("#ACB8C5").s().p("Ah8BMQhOhGBmgyQAngTA1gLQAwgJAgAEQAkAEAgAoQAfAngVAIQhuAsgZAHQg5ASgpAAQgXAAgSgFg");
        this.shape_7.setTransform(28.7,28.6);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.f("#B0BCC9").s().p("AiFBOQhYhHByg0QArgUA7gLQA1gKAjAEQAoAFAfAoQAgAmgYAJIiSA2Qg/AUgsAAQgYAAgSgGg");
        this.shape_8.setTransform(29.5,28.4);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.f("#B4C0CD").s().p("AiOBRQhihKB+g2QAvgVBAgLQA7gKAmAEQArAFAgAnQAfAngaAJQhkAog6ASQhEAWgvAAQgYAAgTgGg");
        this.shape_9.setTransform(30.4,28.3);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.f("#B9C5D1").s().p("AiXBTQhshLCKg4QAzgWBGgLQBBgLAoAFQAvAEAfAoQAfAmgcAJQhsAsg+ATQhIAXgyAAQgaAAgTgHg");
        this.shape_10.setTransform(31.2,28.2);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.f("#BEC9D5").s().p("AihBWQg+gpAPglQANgfBBgaQA4gXBLgMQBGgLArAFQAzAFAfAnQAfAmgeAKQh0AuhCAUQhOAZgzAAQgbAAgUgHg");
        this.shape_11.setTransform(32.1,28);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#C2CDD9").s().p("AiqBYQhDgqAQgnQANgfBHgbQA8gXBQgMQBNgMAuAFQA2AGAfAmQAeAmggALQh7AvhHAWQhSAag2AAQgdAAgUgHg");
        this.shape_12.setTransform(32.9,27.9);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f("#C7D1DD").s().p("AizBbQhIgrARgoQAOghBLgcQBBgYBWgMQBSgMAxAFQA6AFAeAnQAeAlgiAMQiDAyhKAXQhYAcg5AAQgdAAgVgHg");
        this.shape_13.setTransform(33.7,27.8);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#CCD5E1").s().p("Ai8BdQhOgsASgpQAPghBRgdQBEgZBcgNQBYgMAzAFQA+AGAeAmQAeAlglAMQiKA1hPAYQhdAeg7AAQgeAAgVgIg");
        this.shape_14.setTransform(34.5,27.7);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f("#D0DAE4").s().p("AjFBgQhTgtATgrQAQgiBVgeQBJgZBigOQBdgMA2AFQBBAHAfAlQAdAlgnAMQiSA3hSAaQhjAgg+AAQgfAAgVgIg");
        this.shape_15.setTransform(35.4,27.6);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f("#D5DEE8").s().p("AjNBiQhYguATgrQASgkBageQBNgbBngNQBjgNA5AGQBEAGAeAmQANAPgDAOQgDAOgSAGIhwAnQhSAfgvAPQhnAhhAAAQggAAgWgJg");
        this.shape_16.setTransform(36.1,27.4);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f("rgba(214,223,233,0.949)").s().p("AjZBiQhVguAZgsQAVgjBZgeIAXgHQBQgXBagMQBcgMA1AFQBGAHAgAnQAMAQgCAOQgDAPgTAGQgkAKhcAiQhXAegoANQhkAfg+AAQgmAAgXgLg");
        this.shape_17.setTransform(36.6,27.2);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f("rgba(216,223,233,0.898)").s().p("AjlBhQhQgtAegtQAXgjBYgcIAXgHQBUgYBXgNQBdgOA2AFQBIAHAgApQANARgCAPQgDAPgTAGIiIAtIiFAsQhhAeg+AAQgqAAgZgOg");
        this.shape_18.setTransform(37.1,27);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f("rgba(217,224,234,0.847)").s().p("AjwBgQhNgsAkguQAbgiBWgcIAYgHQBYgYBRgOQBfgPA3AFQBJAHAiArQANASgCAPQgDAQgTAGIiPAuQhXAdg2AQQheAcg8AAQgvAAgagRg");
        this.shape_19.setTransform(37.6,26.7);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f("rgba(219,225,235,0.796)").s().p("Aj6BfQhKgrApgvQAegiBVgaIAYgHQDhg9BhAKQBLAHAiAtQAOASgCAQQgDARgUAGIiWAvQhwAjgkALQhIAVg4AEIgXABQg0AAgZgUg");
        this.shape_20.setTransform(38,26.5);

        this.shape_21 = new cjs.Shape();
        this.shape_21.graphics.f("rgba(220,225,235,0.745)").s().p("AkFBeQhHgqAvgwQAighBTgaIAYgGQBsgdA+gMQBhgTA6AGQBLAHAkAvQAPATgDAQQgCASgVAGIidAwIicAvQhIAUg4AEIgSAAQg6AAgZgXg");
        this.shape_21.setTransform(38.5,26.2);

        this.shape_22 = new cjs.Shape();
        this.shape_22.graphics.f("rgba(221,226,236,0.694)").s().p("AkQBeQhDgrA0gwQAlggBTgZIAYgHQCIgjAhgHQBjgUA7AFQBNAIAlAwQAPAUgCARQgDASgVAHQhGAVhfAcIiiAvQhIAVg6ACIgOABQg/AAgZgag");
        this.shape_22.setTransform(39,26);

        this.shape_23 = new cjs.Shape();
        this.shape_23.graphics.f("rgba(223,227,237,0.643)").s().p("AkaBdQgjgXABgYQABgUAbgXQApghBRgXIAYgHICpgrQBkgWA8AGQBOAHAmAzQAQAUgCASQgCATgWAFIisA0IiqAwQhIATg6ACIgLAAQhDAAgZgdg");
        this.shape_23.setTransform(39.4,25.7);

        this.shape_24 = new cjs.Shape();
        this.shape_24.graphics.f("rgba(224,227,238,0.592)").s().p("AkkBcQgigXAEgYQADgUAegXQArggBRgXIAZgGQA1gNBzggQBlgYA+AGQBPAIAnA0QAQAWgBASQgDATgVAGQgvAPiFAmIixAwQhJATg7ABIgGAAQhIAAgZggg");
        this.shape_24.setTransform(39.9,25.4);

        this.shape_25 = new cjs.Shape();
        this.shape_25.graphics.f("rgba(225,228,238,0.541)").s().p("AkuBbQg7gqBHgxQAugfBQgWIAZgGQA1gNBzghQBmgZA/AGQBRAIAoA2QARAWgCATQgCATgWAGQgrAOiRAoQiAAjg4AOQhIATg8AAQhQAAgYgjg");
        this.shape_25.setTransform(40.4,25.2);

        this.shape_26 = new cjs.Shape();
        this.shape_26.graphics.f("rgba(226,229,239,0.49)").s().p("AjPCBQhRgBgXgmQg6gqBOgwQAxgfBPgVIAZgHQA2gMBygjQBngbBBAGQBSAIApA4QARAXgBATQgCAVgXAGQg2ARiMAmIjAAyQhHASg7AAIgDAAg");
        this.shape_26.setTransform(40.8,25);

        this.shape_27 = new cjs.Shape();
        this.shape_27.graphics.f("rgba(227,230,240,0.439)").s().p("AjYCDQhTgBgWgoQg2gqBUgxQAzgeBPgVIAZgGQA2gMBygkQBngdBDAGQBUAIAqA6QARAYgCAUQgBAUgXAHQgyAQiYAoQiBAihGARQhEAQg5AAIgJAAg");
        this.shape_27.setTransform(41.3,24.7);

        this.shape_28 = new cjs.Shape();
        this.shape_28.graphics.f("rgba(229,230,240,0.392)").s().p("AjhCFQhVgDgVgqQg0gpBbgxQA2geBOgUIAagGQA2gMBxgmQBogeBEAGQBVAJAsA7QASAZgCAUQgCAVgXAHQgqAOinAsQiLAkhDAPQhBAQg5AAIgNgBg");
        this.shape_28.setTransform(41.8,24.5);

        this.shape_29 = new cjs.Shape();
        this.shape_29.graphics.f("rgba(230,231,241,0.341)").s().p("AjqCHQhXgDgTgtQgxgqBggwQA4gdBPgTIAagGQA2gMBxgoQBpggBFAHQBXAIAtA+QASAZgCAVQgBAWgYAHQguAPiqArQiWAnhAAOQg+AOg2AAIgUgBg");
        this.shape_29.setTransform(42.2,24.2);

        this.shape_30 = new cjs.Shape();
        this.shape_30.graphics.f("rgba(231,232,242,0.29)").s().p("AjyCKQhZgFgSgvQgvgqBngxQA8gcBMgSIAbgGQALgCCcgzQBpghBIAHQBYAIAtA/QATAagBAWQgCAWgYAIQg0AQisArQilAqg4ALQg9ANg1AAIgWAAg");
        this.shape_30.setTransform(42.7,24);

        this.shape_31 = new cjs.Shape();
        this.shape_31.graphics.f("rgba(233,232,242,0.239)").s().p("Aj7CMQhagGgRgxQgugqBvgxQA7gaBPgTIAbgGQAQgDCXgyQBqgkBJAHQBaAJAuBBQAUAbgCAWQgBAXgZAHQgmANjBAwQipAqg7AMQg6AMgzAAIgdgBg");
        this.shape_31.setTransform(43.1,23.7);

        this.shape_32 = new cjs.Shape();
        this.shape_32.graphics.f("rgba(234,233,243,0.188)").s().p("AkDCOQhcgHgQgzQgognBigtQBLgjBsgVQAUgECTgzQBrgmBLAIQBbAJAvBCQAUAcgBAXQgCAXgYAIQgvAPjAAvQjCAvgqAHQg4ALgyAAIgggBg");
        this.shape_32.setTransform(43.6,23.5);

        this.shape_33 = new cjs.Shape();
        this.shape_33.graphics.f("rgba(235,234,244,0.176)").s().p("AkWCQQhagKgQgzQgqguCOg0QBIgbBggUQATgECXgyQBsgkBJAIQBZAIAxBBQAUAaABAYQABAXgVAKQgXALg7ATQhDAVhFARQiqAphVANQhPANg4AAQgYAAgUgDg");
        this.shape_33.setTransform(45.3,23.3);

        this.shape_34 = new cjs.Shape();
        this.shape_34.graphics.f("rgba(237,236,244,0.165)").s().p("AkXCUQhpgIgQg5QgWgcAmgcQAcgVBFgYQBPgcBngVQASgECbgxQBsgjBIAHQBWAJAzA+QAVAaADAXQADAZgRALQgSAOg2AUQg8AYhCAQQhGARhQAQQhNAQguAFQhpAOg/AAIgjgCg");
        this.shape_34.setTransform(47,23.1);

        this.shape_35 = new cjs.Shape();
        this.shape_35.graphics.f("rgba(238,237,245,0.153)").s().p("AkaCYQh3gHgRg/QgVgdAqgdQAfgVBLgYQBUgeBvgWQANgCCjgyQBtghBGAHQBTAIA3A/QAWAaAFAYQAGAYgPAKQgKARgyAXQgzAXhEARQhCARhXAPQhTAQg3AGQiAAPhHAAIgcgBg");
        this.shape_35.setTransform(48.8,22.9);

        this.shape_36 = new cjs.Shape();
        this.shape_36.graphics.f("rgba(239,239,246,0.141)").s().p("AkdCcQiFgFgShGQgUgfAvgdQAhgVBQgZQBagdB3gYIC0g0QBtgfBEAHQBRAIA4A9QA2A6gbAcQgEATgtAZQguAZg/AQQg+AQheAQQhXAOhDAHQifARhKAAIgSAAg");
        this.shape_36.setTransform(50.6,22.7);

        this.shape_37 = new cjs.Shape();
        this.shape_37.graphics.f("rgba(241,240,247,0.129)").s().p("AkgCgQhEgGgdgKQg4gTgMgtQgUggA0geQAjgTBXgbQBhgfB8gZQAHgBCxgxQBtgeBDAGQBOAIA7A8QA2A5gTAfQABAVgmAbQgoAbg9APQg7APhkAQQhbAOhPAIQjAAThAAAIgTAAg");
        this.shape_37.setTransform(52.3,22.4);

        this.shape_38 = new cjs.Shape();
        this.shape_38.graphics.f("rgba(242,241,248,0.118)").s().p("AkiCjQhKgFgggKQg+gTgNgyQgSgiA5geQAkgTBdgcQBmgeCFgcQA/gMB8glQBugdBBAHQBMAHA8A7QA4A2gMAjQAGAZggAbQgiAdg6APQg4APhpAPQhgAOhbAJIitAPQhIAGgjAAIgSgBg");
        this.shape_38.setTransform(53.9,22.2);

        this.shape_39 = new cjs.Shape();
        this.shape_39.graphics.f("rgba(243,243,248,0.106)").s().p("AknCnQhOgEgjgKQhFgVgOg2QgRgjA+ggQAlgRBkgdQB1giCDgaQA/gNB/gjQBvgcBAAGQBJAIA+A5QA5A0gEAmQAMAbgbAeQgcAfg3AOQg2AOhuAPQhmAOhlAJQj7AXg9AAIgKAAg");
        this.shape_39.setTransform(55.6,22);

        this.shape_40 = new cjs.Shape();
        this.shape_40.graphics.f("rgba(244,244,249,0.094)").s().p("AmmCeQhLgWgOg8QgRglBDggQAngSBqgcQCBgkCEgbQBBgNCBgiQBugaA/AGQBHAHBAA4QA5AzAFAoQAQAfgUAfQgWAgg0AOQgzAOh1APQhoANhyAKQjKASiQAHIgaABQg3AAgogNg");
        this.shape_40.setTransform(57.3,21.9);

        this.shape_41 = new cjs.Shape();
        this.shape_41.graphics.f("rgba(246,245,250,0.082)").s().p("Am0CjQhQgXgQhBQgQgmBIghQAqgRBvgeQCagoB5gYQBCgOCDggQBvgZA9AGQBDAGBBA4QA1AuAUAtQARAmgMAeQgOAhgxANQgvANh7APQhrANh/ALQi7APi3ALIgjABQg2AAgpgLg");
        this.shape_41.setTransform(59,21.6);

        this.shape_42 = new cjs.Shape();
        this.shape_42.graphics.f("rgba(247,247,251,0.071)").s().p("AnDCmQhXgYgRhFQgPgoBNghQAqgRB3geQC2gtBqgWQBDgOCFgfQBvgXA8AGQBBAGBDA3QA2AsAbAvQAYApgHAgQgJAjgtAMQgtANiAAOQhxAOiJAKQinAOjjAPQgWACgVAAQg0AAgqgMg");
        this.shape_42.setTransform(60.7,21.5);

        this.shape_43 = new cjs.Shape();
        this.shape_43.graphics.f("rgba(248,248,251,0.059)").s().p("AnVCrQhcgZgShKQgPgqBTggQArgSB9gfQDCgvBsgWQBEgOCHgeQBvgWA7AGQA/AGBFA2QA4AqAhAyQAfAsgCAhQgDAlgrAMQgqAMiGAOQhzANiWAMImiAfQgbACgZAAQgzAAgrgLg");
        this.shape_43.setTransform(62.5,21.2);

        this.shape_44 = new cjs.Shape();
        this.shape_44.graphics.f("rgba(250,250,252,0.047)").s().p("AnnCvQhigagThPQgOgsBYghQAtgSCDgeICGggQBngYBOgPIDPgrQBvgVA6AGQA9AGBHAzQA5AqAoA0QAlAuADAkQADAngoALQhLAVmBAdIkUAUQiLAKgbAEQgeADgcAAQgzAAgtgLg");
        this.shape_44.setTransform(64.2,21.1);

        this.shape_45 = new cjs.Shape();
        this.shape_45.graphics.f("rgba(251,251,253,0.035)").s().p("An5CzQhpgbgThTQgNguBcgiQAvgRCJgfICLggQBugZBPgRIDSgqQBwgTA4AGQA8AGBIAyQA7AoAvA2QArAxAJAlQAJAqgmAKQhGAVmZAdIklAVQiRALgcAEQghAEggAAQgzAAgtgLg");
        this.shape_45.setTransform(65.9,20.9);

        this.shape_46 = new cjs.Shape();
        this.shape_46.graphics.f("rgba(252,252,254,0.024)").s().p("AoMC3QhugcgVhYQgMgvBhgjQAxgSCPgeICPghQBzgaBUgRQCeggA3gJQBvgSA4AGQA6AFBKAxQA9AoA1A4QAxAzAOAnQAPArgkALQhAATmxAeIk2AWQiXALgcAFQglAFgkAAQgyAAgvgLg");
        this.shape_46.setTransform(67.6,20.7);

        this.shape_47 = new cjs.Shape();
        this.shape_47.graphics.f("rgba(254,254,254,0.012)").s().p("AofC7Qh1gdgVhcQgMgyBmgjQA1gSCUgeQDRgxCRgdQCKgdBPgLQBvgRA3AGQA4AFBLAvQBBAoA6A5QA3A1ATAqQAVAtggAKQg0AQnQAhQniAiggAGQgoAHgnAAQgyAAgwgMg");
        this.shape_47.setTransform(69.3,20.5);

        this.shape_48 = new cjs.Shape();
        this.shape_48.graphics.f("rgba(255,255,255,0)").s().p("AozC/Qh6gegXhhQgLgzBrgkQA1gSCcgfQAagFB9gcQCEgeBVgRQEeg6BiAJQA4AGBMAtQBEAoA/A6QA9A4AZAsQAbAvgeAJQgcAJiiAOQhsAJjtARIlYAYQilAMgcAGQgrAIgqAAQgzAAgygMg");
        this.shape_48.setTransform(71,20.3);

        this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_48},{t:this.shape_47},{t:this.shape_46},{t:this.shape_45},{t:this.shape_44},{t:this.shape_43},{t:this.shape_42},{t:this.shape_41},{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33},{t:this.shape_32},{t:this.shape_31},{t:this.shape_30},{t:this.shape_29},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

    }).prototype = this.getMCSymbolPrototype(lib.Blend, new cjs.Rectangle(0,0,142.1,40.6), null);


    (lib.TechnicalProblems_MC = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{});

        // Layer 1
        this.shape = new cjs.Shape();
        this.shape.graphics.f("#E6E7E8").s().p("Ai4CeQgFgBgCgFQgCgEACgFIAsiCQAEgMAXgHIDYiVIADgBQASgGALALIA9A+QAEADAAAFQAAAGgEADQgEAEgFAAQgFAAgEgEIg9g9IjaCTIgCABIgPAHIgrCBQgDAIgJAAg");
        this.shape.setTransform(90.3,10,0.498,0.498);

        this.shape_1 = new cjs.Shape();
        this.shape_1.graphics.lf(["#A2A4A7","#949699","#737477"],[0,0.369,1],0,-21.1,0,21.1).s().p("Ah4DOIhVhVQgHgHADgLIAsh/QADgKAMgFID9iqQALgEAIAIIBUBVIABAAQAIAKgIAMIinD6QgEALgLAEIh/ArIgHABQgGAAgFgFg");
        this.shape_1.setTransform(90.6,12,0.498,0.498);

        this.shape_2 = new cjs.Shape();
        this.shape_2.graphics.f("#DD9E00").s().p("Ai/DrQgmgEgcgcQgVgVgHgaQgIgaAHgZQADgIAHgFQAIgEAJADQAIACAFAIQAEAIgCAIQgEANAFAQQAFAPALALQARARAXADQATABANgMIGYmZQAHgGAJAAQAIAAAHAGQAGAHAAAJQAAAJgGAGImZGZQgXAXgjAAg");
        this.shape_2.setTransform(37,78.1,0.498,0.498);

        this.shape_3 = new cjs.Shape();
        this.shape_3.graphics.f("#B77300").s().p("AkYD3QgJgCgEgIQgFgIADgIQAFgVAPgPIGYmYQAagaAnADQAnADAdAdQAdAdACAmQADAngaAaQgGAGgJAAQgJAAgGgGQgGgGAAgJQAAgJAGgHQANgMgDgVQgCgVgRgRQgQgRgVgCQgVgDgNANImZGZQgGAGgDAKQgFAQgQAAIgFgBg");
        this.shape_3.setTransform(37.5,72.4,0.498,0.498);

        this.shape_4 = new cjs.Shape();
        this.shape_4.graphics.f("#FCE55E").s().p("Ai/DrQgmgEgcgcQgVgVgHgaQgIgaAHgZQADgIAHgEQAIgFAJACQAIADAEAIQAFAIgDAIQgDANAFAPQAFAQALALQARARAXADQATABANgMIGYmZQAHgGAJAAQAIAAAHAGQAGAHAAAJQAAAJgGAGImZGZQgXAXgjAAg");
        this.shape_4.setTransform(28.1,69.2,0.498,0.498);

        this.shape_5 = new cjs.Shape();
        this.shape_5.graphics.f("#B77300").s().p("AkZD3QgJgDgEgHQgEgIACgJQAFgTAPgPIGZmZQAagaAmADQAnADAdAdQAgAfAAArQAAAigXAYQgHAGgIAAQgJAAgHgGQgGgHAAgIQAAgJAGgHQALgKAAgRQAAgZgTgTQgRgRgVgCQgVgDgNANImYGZQgHAGgDAKQgCAHgFAFQgGAEgHAAg");
        this.shape_5.setTransform(28.6,63.5,0.498,0.498);

        this.shape_6 = new cjs.Shape();
        this.shape_6.graphics.rf(["#FDF35B","#F6E552","#E1B834","#D1971C","#C88309","#C57C01"],[0,0.078,0.373,0.635,0.851,1],-9.6,-11.7,0,-9.6,-11.7,29.1).s().p("AAbCqIjFjFQgdgdAAgqQAAgqAdgeQAegdAqgBQAqABAdAdIDGDFQAdAeAAAqQAAAqgdAdQgeAegqABQgqAAgegfg");
        this.shape_6.setTransform(59.4,43.3,0.498,0.498);

        this.shape_7 = new cjs.Shape();
        this.shape_7.graphics.lf(["#FAC800","#FBD900","#FCE739","#FDEF53","#FDF35B","#FBE22A","#FAD400","#FACB00","#FAC800","#EEB800","#D89700","#CA8300","#C57C01"],[0,0.047,0.102,0.141,0.173,0.227,0.282,0.329,0.361,0.431,0.596,0.733,0.827],-20.9,-18.4,18,20.5).s().p("AkEHqQgbgDgSgSIijijQgSgSgDgbQgCgbANgaQgPgzAMgzQANg1AngnIG9m+QA5g5BRAAQBQAAA5A5ICOCOQA5A5AABQQAABRg5A5Im+G9QgnAng0ANQg0ANgzgQQgWALgWAAIgJAAg");
        this.shape_7.setTransform(34.2,68.5,0.498,0.498);

        this.shape_8 = new cjs.Shape();
        this.shape_8.graphics.lf(["#EBC962","#F1C930","#F6C900","#F9C800","#FAC800","#EEB800","#D89700","#CA8300","#C57C01"],[0,0.067,0.137,0.192,0.231,0.325,0.533,0.71,0.827],-10.5,-10.5,10.4,10.4).s().p("AgaCTIh5h4QgVgVAAgeQAAgeAVgVIBIhIQAVgVAfAAQAcAAAWAVIB4B5QAWAWAAAcQAAAfgWAVIhHBHQgVAWgfAAQgcAAgWgWg");
        this.shape_8.setTransform(53.1,49.5,0.498,0.498);

        this.shape_9 = new cjs.Shape();
        this.shape_9.graphics.lf(["#A6A8AB","#D7D8DA","#C9CACC","#A3A4A6","#6D6E70"],[0,0.176,0.286,0.49,0.741],-4.7,-4.7,4.7,4.7).s().p("Aj0EbIgnglQgLgMAAgQQAAgRALgMIHYnYQAMgLAQAAQARAAALALIAmAmQAMAMAAARQAAAQgMAMInXHXQgMAMgQAAQgRAAgLgMg");
        this.shape_9.setTransform(71,31.7,0.498,0.498);

        this.shape_10 = new cjs.Shape();
        this.shape_10.graphics.lf(["#FFFFFF","#909295"],[0,1],-88.1,0,88.1,0).s().p("AGSNkQhBgbgzgyQhKhKgWhnQgWhmAlhjIpppoQg8AWhBAAQhIAAhBgbQhBgbgzgyQhEhEgYhdQgZheAahcQAEgNANgEIAGgBQAKAAAGAHIDDDCIBrALIBmhnIgLhqIjCjDQgKgJAEgNQADgNAOgEQAvgNAwAAQBIAABBAbQBBAbAyAyQBMBMAVBoQAWBognBkIJlJlQA/gZBEAAQBHAABCAbQBBAbAyAyQBEBEAZBdQAYBegaBdQgDAMgNAEIgGABQgKAAgHgHIjGjGIhtgLIhlBkIALBuIDGDGQAKAIgEAOQgDANgNAEQgwANgwAAQhHAAhBgbgADtGWIgDAJQglBcATBhQAUBhBGBGQAvAvA8AZQA7AYBCAAQAoAAApgKIjIjIIgNiEIB3h3ICEANIDIDIQAWhUgXhUQgYhUg9g9Qgugvg8gYQg8gZhCAAQhEAAg9AaIgJAEIqAqAIAEgJQAohdgThiQgThjhIhHQgugvg8gYQg8gZhCAAQgoAAgpAKIDEDEIANCCIh5B5IiCgNIjEjEQgVBUAXBUQAXBUA9A9QAvAvA8AZQA8AYBCAAQBAAAA7gYIAJgDg");
        this.shape_10.setTransform(63.5,45.3,0.498,0.498);

        this.shape_11 = new cjs.Shape();
        this.shape_11.graphics.lf(["#DDDFE0","#CFD1D2","#AAACAF"],[0,0.349,1],-72.5,-72.5,65.5,65.5).s().p("AGXNXQg+gagxgwQhKhKgUhnQgThkAmheIp2p2Qg8AZhEAAQhFAAg+gaQg/gZgxgxQhBhBgYhaQgXhZAYhaQACgFAFgCIADAAQADAAAEADIDFDGIB3ALIBvhvIgLh3IjGjGQgEgDACgGQAAgFAGgCQAvgMAtAAQBFAAA+AaQA/AaAwAwQBLBLAUBpQATBmgpBfIJyJyQBAgbBHAAQBEAAA/AaQA/AaAwAwQBCBCAXBZQAYBagZBZQgCAFgFACIgCAAQgEAAgDgDIjKjKIh5gLIhtBtIAMB5IDJDKQAEAEgBAFQgCAFgFACQgvAMgtAAQhEAAg/gag");
        this.shape_11.setTransform(63.5,45.3,0.498,0.498);

        this.shape_12 = new cjs.Shape();
        this.shape_12.graphics.f("#6D6E70").s().p("AGFODQhIgdg3g3QhNhOgahpQgahqAhhoIpLpLQg5ASg7AAQhPAAhHgdQhHgeg3g4QhKhKgbhlQgbhnAbhmQAEgOALgLQALgLAPgDIAPgDQAXAAARARIC6C6IBPAIIBQhQIgIhPIi6i6QgKgLgEgOQgEgPADgPQAEgPALgKQALgMAOgDQAzgPA2AAQBOAABHAeQBIAdA3A3QBOBPAaBsQAZBrgjBpIJHJHQA6gUBBAAQBOAABHAdQBHAeA4A4QBKBJAbBnQAbBmgcBmQgFAOgLALQgLALgOADIgPADQgYAAgQgRIi+i+IhRgIIhOBOIAIBRIC+C+QALALAEAOQAEAPgEAPQgEAPgLAKQgLAMgPADQgyAPg2AAQhOAAhHgeg");
        this.shape_12.setTransform(64.5,46.3,0.498,0.498);

        this.instance = new lib.Blend();
        this.instance.parent = this;
        this.instance.setTransform(111.2,87.6,0.498,0.498,0,0,0,71,20.4);

        this.shape_13 = new cjs.Shape();
        this.shape_13.graphics.f("#8B9AA9").s().p("AhvBQQgRhQAogvQAhgpAtAGQASACA8A8QA7A6gLAGQhLAoheAAQgcAAgegEg");
        this.shape_13.setTransform(20.2,92.7,0.498,0.498);

        this.shape_14 = new cjs.Shape();
        this.shape_14.graphics.f("#909EAD").s().p("Ah/BUQgihSA8gzQAzgsA6AHQAaADA7A6QA7A6gPAHQhnAwhlAAQgeAAgegEg");
        this.shape_14.setTransform(20.9,92.6,0.498,0.498);

        this.shape_15 = new cjs.Shape();
        this.shape_15.graphics.f("#94A3B1").s().p("AiOBXQgzhTBQg3QAegVArgLQAngKAdADQAhAEA6A6QA7A5gTAHQiFA4hsAAQgfAAgdgFg");
        this.shape_15.setTransform(21.7,92.6,0.498,0.498);

        this.shape_16 = new cjs.Shape();
        this.shape_16.graphics.f("#99A7B5").s().p("AieBbQhFhWBlg6QAmgWA1gMQAwgKAjADQAnAEA6A6QA6A4gXAIQhaAjhBAOQhAAPg4AAQghAAgegFg");
        this.shape_16.setTransform(22.4,92.5,0.498,0.498);

        this.shape_17 = new cjs.Shape();
        this.shape_17.graphics.f("#9EABB9").s().p("AitBeQhWhYB4g9QAugXA/gMQA5gMApAEQAtAFA6A5QA5A3gaAKQhtAnhEAPQhJARg8AAQgjAAgegGg");
        this.shape_17.setTransform(23.2,92.4,0.498,0.498);

        this.shape_18 = new cjs.Shape();
        this.shape_18.graphics.f("#A2AFBD").s().p("Ai9BiQhnhbCMhAQA2gYBJgNQBDgMAtAEQA0AFA6A5QA4A3geAKQiGAtg/AOQhTAUhBAAQglAAgegGg");
        this.shape_18.setTransform(23.9,92.3,0.498,0.498);

        this.shape_19 = new cjs.Shape();
        this.shape_19.graphics.f("#A7B3C1").s().p("AjLBlQh5hdChhCQA8gaBUgNQBMgNAzAFQA6AFA5A4QAYAXAHATQAHASgPAFQihA0g5ANQhdAWhFAAQgmAAgfgHg");
        this.shape_19.setTransform(24.6,92.2,0.498,0.498);

        this.shape_20 = new cjs.Shape();
        this.shape_20.graphics.f("#ACB8C5").s().p("AjcBpQhJgzATguQARgmBQgfQBEgaBegOQBWgNA4AFQBAAFA5A4QAXAXAGASQAGATgRAFQjGA9gpAJQhmAZhKAAQgoAAgfgHg");
        this.shape_20.setTransform(25.3,92.1,0.498,0.498);

        this.shape_21 = new cjs.Shape();
        this.shape_21.graphics.f("#B0BCC9").s().p("AjsBsQhSg0AVgwQASgnBZggQBMgcBogOQBggNA9AFQBGAGA4A3QAYAWAEATQAFATgTAFQjtBHgWAFQhvAbhPAAQgpAAghgIg");
        this.shape_21.setTransform(26.1,92,0.498,0.498);

        this.shape_22 = new cjs.Shape();
        this.shape_22.graphics.f("#B4C0CD").s().p("Aj8BvQhbg1AXgxQATgoBigiQBTgdBygPQBqgOBCAGQBNAGA4A3QAXAXADASQAEATgVAGQixA4hnAZQh4AdhSAAQgsAAgigJg");
        this.shape_22.setTransform(26.8,91.9,0.498,0.498);

        this.shape_23 = new cjs.Shape();
        this.shape_23.graphics.f("#B9C5D1").s().p("AkMBzQhlg3AZgzQAVgqBrgiQBbgeB8gPQBzgPBHAGQBUAHA3A2QAXAWACATQADATgXAGQi/A7huAbQiBAghXAAQguAAgigJg");
        this.shape_23.setTransform(27.5,91.9,0.498,0.498);

        this.shape_24 = new cjs.Shape();
        this.shape_24.graphics.f("#BEC9D5").s().p("AkcB2Qhug4Abg0QAWgrB0gkQBjgfCFgQQB9gPBNAGQBaAHA3A2QAWAXABASQACAUgZAFQjMA/h2AdQiKAihbAAQgwgBgjgJg");
        this.shape_24.setTransform(28.3,91.8,0.498,0.498);

        this.shape_25 = new cjs.Shape();
        this.shape_25.graphics.f("#C2CDD9").s().p("AksB6Qh3g6Acg2QAYgsB9glQBqggCQgRQCHgPBRAGQBgAIA3A1QAWAWAAATQAAATgaAHQjaBCh8AeQiUAlhgAAQgxAAgkgKg");
        this.shape_25.setTransform(29,91.7,0.498,0.498);

        this.shape_26 = new cjs.Shape();
        this.shape_26.graphics.f("#C7D1DD").s().p("Ak8B9QiAg7Aeg3QAZguCGgmQByghCZgRQCRgQBWAGQBnAJA2A0QAXAWgCATQgBATgcAIQjnBFiEAgQidAnhjAAQg0AAglgLg");
        this.shape_26.setTransform(29.7,91.6,0.498,0.498);

        this.shape_27 = new cjs.Shape();
        this.shape_27.graphics.f("#CCD5E1").s().p("AlMCBQiKg9Agg5QAbgvCOgnQB6giCjgSQCbgRBbAHQBtAJA2A0QAWAWgCATQgDATgdAIQj1BIiLAiQinAqhoAAQg1AAglgLg");
        this.shape_27.setTransform(30.5,91.5,0.498,0.498);

        this.shape_28 = new cjs.Shape();
        this.shape_28.graphics.f("#D0DAE4").s().p("AlcCEQiTg+Ahg6QAdgwCXgpQCBgjCugSQCkgSBgAIQB0AJA1A0QAXAVgEATQgEATgfAIQkCBMiTAkQivAshsAAQg4AAgmgMg");
        this.shape_28.setTransform(31.2,91.4,0.498,0.498);

        this.shape_29 = new cjs.Shape();
        this.shape_29.graphics.f("#D5DEE8").s().p("AltCHQicg/Ajg8QAegxCggqQCJgkC4gTQCugSBlAIQB6AJA1AzQAWAWgFATQgFATghAIQgzANiSAqQiSAqhTAUQi3AvhwAAQg6AAgogNg");
        this.shape_29.setTransform(31.9,91.3,0.498,0.498);

        this.shape_30 = new cjs.Shape();
        this.shape_30.graphics.f("#D6DFE9").s().p("AmCCHQiVg/Asg9QAkgwCdgpIAzgMQCNgfCdgRQCfgQBdAHQB8AJA3A2QAXAXgEATQgFAVgiAIQg2ANitAwQicAqhFARQixArhuAAQhDAAgqgPg");
        this.shape_30.setTransform(32.3,91.2,0.498,0.498);

        this.shape_31 = new cjs.Shape();
        this.shape_31.graphics.f("#D8DFE9").s().p("AmVCFQiPg9A1g+QApgwCbgoIAzgLQCUggCWgSQCjgSBeAHQB/AJA5A5QAXAXgEAVQgFAVgiAIIjwA+Qh+AihvAbQirAphtAAQhLAAgsgUg");
        this.shape_31.setTransform(32.8,91,0.498,0.498);

        this.shape_32 = new cjs.Shape();
        this.shape_32.graphics.f("#D9E0EA").s().p("AmpCFQhJghgQggQgPgdAdgeQAwgwCYgmIAzgLQCfgiCLgRQCmgWBgAIQCBAKA7A7QAYAYgEAVQgEAXgjAIIj9BAQihAohZAVQiAAehhAHQgaACgWAAQhUAAgtgXg");
        this.shape_32.setTransform(33.2,90.8,0.498,0.498);

        this.shape_33 = new cjs.Shape();
        this.shape_33.graphics.f("#DBE1EB").s().p("Am8CEQhGgggMghQgLgdAigeQAagXA3gWQA0gWBFgRIA1gLQGNhSCnANQCDAKA9A+QAZAZgEAWQgEAXgkAJIkKBBQiVAlhyAaQiAAdhiAGIgpABQhcAAgtgbg");
        this.shape_33.setTransform(33.6,90.7,0.498,0.498);

        this.shape_34 = new cjs.Shape();
        this.shape_34.graphics.f("#DCE1EB").s().p("AnPCDQhDgggIghQgHgcAngfQAdgWA3gWQA1gVBFgRIA0gLQDHgoBjgPQCrgaBkAIQCGAKA/BAQAaAbgEAXQgEAXglAJIkXBDQiaAlh6AbQiAAdhkAEIggABQhmAAgtgfg");
        this.shape_34.setTransform(34,90.5,0.498,0.498);

        this.shape_35 = new cjs.Shape();
        this.shape_35.graphics.f("#DDE2EC").s().p("AnhCBQhBgfgEghQgDgcAsggQAggVA3gVQA3gVBDgQIA1gLQD5gxAwgIQCtgcBnAIQCIAKBBBDQAbAcgEAXQgEAZglAJIkkBEQiXAjiKAeQh/AchmADIgaABQhuAAgsgkg");
        this.shape_35.setTransform(34.4,90.3,0.498,0.498);

        this.shape_36 = new cjs.Shape();
        this.shape_36.graphics.f("#DFE3ED").s().p("AnzCAQg/gfACghQAAgcAxggQBFgsCOghIA2gLIEpg7QCwgeBpAIQCLAKBCBGQAcAcgEAZQgEAZgmAJQiGAgiqAnQjFArhpAWQiAAbhnADIgSAAQh3AAgsgog");
        this.shape_36.setTransform(34.8,90.1,0.498,0.498);

        this.shape_37 = new cjs.Shape();
        this.shape_37.graphics.f("#E0E3EE").s().p("AoFB/Qg8gfAFghQAFgdA1gfQBKgrCNggIA3gLQBegSDKgrQCyggBrAIQCOAKBFBIQAcAegEAZQgDAbgnAIQhUAVjqA0Ik6BDQiBAahoABIgJAAQiBAAgsgsg");
        this.shape_37.setTransform(35.2,90,0.498,0.498);

        this.shape_38 = new cjs.Shape();
        this.shape_38.graphics.f("#E1E4EE").s().p("AoWB+Qg6ggAKghQAIgdA7gfQBQgrCKgeIA3gLQBegRDKgtQCzgjBvAIQCQALBGBLQAeAegEAaQgDAcgnAIQhhAYjqAyQjaAvhuAVQiAAahqAAQiMAAgrgwg");
        this.shape_38.setTransform(35.6,89.8,0.498,0.498);

        this.shape_39 = new cjs.Shape();
        this.shape_39.graphics.f("#E2E5EF").s().p("AlwCyQiPgBgpg0Qg3ggAPghQAMgcA/ggQBWgqCHgdIA3gKQBfgRDKgwQC0glByAIQCSAMBJBNQAeAfgDAbQgEAcgnAJQhbAWj9A2QjPAriGAaQh8AYhnAAIgJAAg");
        this.shape_39.setTransform(36,89.6,0.498,0.498);

        this.shape_40 = new cjs.Shape();
        this.shape_40.graphics.f("#E3E6F0").s().p("AmAC1QiTgDgmg3Qhgg5CShDQBYgpCIgdIA4gKQBfgRDKgyQC2gnB1AJQCUALBLBPQAfAhgDAcQgDAcgpAKQhPAUkWA5Qj/A0hjASQh2AXhmAAIgRAAg");
        this.shape_40.setTransform(36.5,89.5,0.498,0.498);

        this.shape_41 = new cjs.Shape();
        this.shape_41.graphics.f("#E5E6F0").s().p("AmPC4QiWgEglg6QgygfAYgiQATgdBJgeQBcgoCHgcIA5gKQBfgRDJg0QC4gqB4AKQCXALBNBSQAfAigDAcQgDAdgpAKQhIASkqA9QjlAuiJAZQhzAVhjAAIgZAAg");
        this.shape_41.setTransform(36.9,89.3,0.498,0.498);

        this.shape_42 = new cjs.Shape();
        this.shape_42.graphics.f("#E6E7F1").s().p("AmfC7QiZgFgig+QhYg5CphDQBfgmCHgbIA5gLQA6gJBYgXICWgmQC6gsB7AJQCZAMBPBVQAhAigDAeQgDAdgqALQhgAXkfA5QkQA2hsASQhxAUhhAAIgegBg");
        this.shape_42.setTransform(37.3,89.1,0.498,0.498);

        this.shape_43 = new cjs.Shape();
        this.shape_43.graphics.f("#E7E8F2").s().p("AmuC+QidgHgghAQhTg5C0hDQBhglCJgbIA5gKQA6gJBYgXICWgoQC7gvB+AKQCcAMBRBXQAhAkgCAeQgDAegqALQhSAUk7A+QkvA7hZAOQhrAShdAAIgqgBg");
        this.shape_43.setTransform(37.7,89,0.498,0.498);

        this.shape_44 = new cjs.Shape();
        this.shape_44.graphics.f("#E9E8F2").s().p("Am9DBQiggJgehDQgqgfAkgiQAggeBXgdQBjgjCKgbIA6gKQA7gJBXgYICWgpQC7gxCCAKQCfAMBSBaQAiAlgCAeQgDAggrALQhRATlJBAQk2A8hfAPQhnAQhaAAIgygBg");
        this.shape_44.setTransform(38.1,88.8,0.498,0.498);

        this.shape_45 = new cjs.Shape();
        this.shape_45.graphics.f("#EAE9F3").s().p("AnMDEQijgKgbhGQhHg2Csg+QCFgwDAgeQA7gJBXgYICWgrQC9gzCFAKQChAMBVBcQAiAmgCAgQgDAggrALQhbAWlMA/QlHA+hbAOQhkAPhWAAQgfAAgcgCg");
        this.shape_45.setTransform(38.5,88.6,0.498,0.498);

        this.shape_46 = new cjs.Shape();
        this.shape_46.graphics.f("#EBEAF4").s().p("AnrDHQiigNgbhHQhLhBEAhIQCBgmCkgZQA9gKBYgXICZgqQC+gxCCAKQCdAMBYBYQAkAlABAgQACAhglAOQgnAPhsAaQh0Ach8AYQh/AZiGAWQh/AVg/AHQhRAKhKAEQgxADgoAAQgoAAgggDg");
        this.shape_46.setTransform(40,88.5,0.498,0.498);

        this.shape_47 = new cjs.Shape();
        this.shape_47.graphics.f("#EDECF4").s().p("AnuDMQi7gKgchQQgogmBEgnQA0geB9giQCQgnCtgbQA+gKBagXICbgoQDAgvB/AJQCYAMBaBVQAmAjAFAhQAGAigeAQQghATheAcQhsAhh1AWQh6AYiQAWQiJAVhRAIQi3AShwAAQgjAAgcgCg");
        this.shape_47.setTransform(41.5,88.3,0.498,0.498);

        this.shape_48 = new cjs.Shape();
        this.shape_48.graphics.f("#EEEDF5").s().p("AnzDSQjTgJgehYQgngoBNgoQA4geCGgiQCagoC7gdQA/gKBegXICdgnQDAguB8AKQCTALBhBXQAnAjAKAhQAJAigaAOQgSAYhYAfQhcAgh2AXQh1AXiaAWQiTAUhjAJQjkAVh6AAIgzgBg");
        this.shape_48.setTransform(43,88.2,0.498,0.498);

        this.shape_49 = new cjs.Shape();
        this.shape_49.graphics.f("#EFEFF6").s().p("An3DXQjrgGghhhQglgqBWgpQA8gdCQgkQCpgpDEgfQBAgKBegWIChgmQDBgsB5AJQCPALBkBVQApAjANAhQAOAigVAQQgIAchOAhQhRAjhxAWQhvAWilAWQibAUh3AKQiCALh0AGQhpAFg+AAIgeAAg");
        this.shape_49.setTransform(44.6,88.1,0.498,0.498);

        this.shape_50 = new cjs.Shape();
        this.shape_50.graphics.f("#F1F0F7").s().p("An8DcQh5gIg0gNQhkgagVg/QgjgtBdgqQBAgbCaglQC5gsDMggQBCgKBggWICjglQDDgpB2AJQCKAKBoBTQAqAiASAiQASAigPATQABAehEAkQhGAmhsAVQhqAVivAWQijAUiLAKQjBAPhUAFQhrAHg9AAIgpgBg");
        this.shape_50.setTransform(46.1,87.9,0.498,0.498);

        this.shape_51 = new cjs.Shape();
        this.shape_51.graphics.f("#F2F1F8").s().p("AoBDhQiBgGg6gOQhvgbgXhFQghgvBmgrQBDgbClglQC+gsDfgjQBugRDcgzQDDgnB0AIQCGALBrBRQAsAhAWAiQAVAigJAVQALAig5AnQg8AnhnAVQhkAUi6AVQirAUifALIkzAWQh9AHg/AAIghAAg");
        this.shape_51.setTransform(47.6,87.8,0.498,0.498);

        this.shape_52 = new cjs.Shape();
        this.shape_52.graphics.f("#F3F3F8").s().p("AoKDmQiLgFg/gPQh5gcgYhLQgggxBvgsQBGgaCvgmQDIgtDtglQBwgSDhgxQDDgmByAJQCCAKBuBQQBkBIgHAzQAUAnguAoQgyArhhATQhgAUjDAVQizATi0AMIlRAXQiTAJhAAAIgWAAg");
        this.shape_52.setTransform(49.1,87.6,0.498,0.498);

        this.shape_53 = new cjs.Shape();
        this.shape_53.graphics.f("#F4F4F9").s().p("ArtDbQiDgfgbhTQgegzB4gsQBHgaC8gnQDkgxDogkQBzgSDkgvQDFgkBuAIQB+AKBxBOQBmBFAHA3QAeArgkArQgnAthdATQhaATjOAUQi5ATjJANQivAMjAAKQiuAKhIACIgwABQhgAAhIgQg");
        this.shape_53.setTransform(50.6,87.5,0.498,0.498);

        this.shape_54 = new cjs.Shape();
        this.shape_54.graphics.f("#F6F5FA").s().p("AsEDgQiPgfgchZQgcg2CAgtQBJgZDIgoQETg4DRghQB1gSDogtQDFgiBsAIQB3AJBzBOQBeA/AjA9QAfA3gXAoQgZAthWASQhVASjYAVQjDATjbANQjnAPmoAWIg8ACQhgAAhKgRg");
        this.shape_54.setTransform(52.1,87.4,0.498,0.498);

        this.shape_55 = new cjs.Shape();
        this.shape_55.graphics.f("#F7F7FB").s().p("AshDmQiZghgehfQgbg5CJgtQBLgYDUgqQEgg5DcgiQB3gTDrgrQDGggBqAIQBzAIB3BNQBgA8AvBBQArA6gNArQgPAwhSARQhPARjjAVQjGARj0APImsAZIkOAPQgoADgmAAQhbAAhLgQg");
        this.shape_55.setTransform(53.6,87.2,0.498,0.498);

        this.shape_56 = new cjs.Shape();
        this.shape_56.graphics.f("#F8F8FB").s().p("As/DrQikgigfhmQgag6CSguQBOgZDegpQFMg/DJggQB5gTDvgqQDFgeBoAIQBwAJB7BKQBiA6A7BEQA3A+gEAuQgFAyhNARQhKAQjtAUQjLASkMAQInKAaQjqANgvAEQgvADgrAAQhcAAhNgQg");
        this.shape_56.setTransform(55.1,87.1,0.498,0.498);

        this.shape_57 = new cjs.Shape();
        this.shape_57.graphics.f("#FAFAFC").s().p("AteDxQivgkghhsQgYg8CbgvQBQgYDpgrIDsgrQC3ghCJgVQB9gUDygoQDFgcBmAIQBtAIB9BIQBlA5BHBHQBCBBAFAxQAGA1hIAQQiFAdqqAoInoAcQj3AOgvAEQg0AFgyAAQhbAAhPgQg");
        this.shape_57.setTransform(56.6,87,0.498,0.498);

        this.shape_58 = new cjs.Shape();
        this.shape_58.graphics.f("#FBFBFD").s().p("At/D2Qi5glgjhyQgXg/CkgvQBUgZDzgqID0gsQDBgjCPgWQFSg1AigFQDGgaBkAHQBqAICABGQBoA4BTBKQBNBEAOAzQAQA4hDAQQh9AcrTAoIoHAdQkBAPgxAFQg7AGg4AAQhaAAhRgQg");
        this.shape_58.setTransform(58.2,86.8,0.498,0.498);

        this.shape_59 = new cjs.Shape();
        this.shape_59.graphics.f("#FCFCFE").s().p("AugD8QjEgngkh4QgWhCCsgwQBagaD8gpID8gtQDMgjCTgYQEUgsBmgNQDGgYBiAHQBnAICDBDQBsA4BdBMQBYBHAYA3QAbA7g/AOQhsAZsEAsIomAeQkKAPg0AGQhBAIg+AAQhaAAhTgQg");
        this.shape_59.setTransform(59.7,86.7,0.498,0.498);

        this.shape_60 = new cjs.Shape();
        this.shape_60.graphics.f("#FEFEFE").s().p("AvDECQjOgogmh/QgVhEC2gxQBcgaEHgpIEEguQDWgmCZgYQD7gnCFgQQDGgXBgAIQBkAHCFBBQByA4BnBOQBiBKAiA5QAlA/g6ANQheAXszAtIpEAgQkYAQgyAGQhIAKhFAAQhZAAhVgQg");
        this.shape_60.setTransform(61.2,86.6,0.498,0.498);

        this.shape_61 = new cjs.Shape();
        this.shape_61.graphics.f("#FFFFFF").s().p("AvmEHQjZgpgoiFQgThHC+gxQBfgaESgqQAtgHDfgnQDpgoCWgYQH/hRCrANQBiAICHA+QB4A4BwBQQBsBMAsA9QAwBBg1ANQhSAUthAwIpiAhQkkAQgyAIQhMALhLAAQhaAAhYgRg");
        this.shape_61.setTransform(62.7,86.4,0.498,0.498);

        this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_61},{t:this.shape_60},{t:this.shape_59},{t:this.shape_58},{t:this.shape_57},{t:this.shape_56},{t:this.shape_55},{t:this.shape_54},{t:this.shape_53},{t:this.shape_52},{t:this.shape_51},{t:this.shape_50},{t:this.shape_49},{t:this.shape_48},{t:this.shape_47},{t:this.shape_46},{t:this.shape_45},{t:this.shape_44},{t:this.shape_43},{t:this.shape_42},{t:this.shape_41},{t:this.shape_40},{t:this.shape_39},{t:this.shape_38},{t:this.shape_37},{t:this.shape_36},{t:this.shape_35},{t:this.shape_34},{t:this.shape_33},{t:this.shape_32},{t:this.shape_31},{t:this.shape_30},{t:this.shape_29},{t:this.shape_28},{t:this.shape_27},{t:this.shape_26},{t:this.shape_25},{t:this.shape_24},{t:this.shape_23},{t:this.shape_22},{t:this.shape_21},{t:this.shape_20},{t:this.shape_19},{t:this.shape_18},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_14},{t:this.shape_13},{t:this.instance},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

    }).prototype = this.getMCSymbolPrototype(lib.TechnicalProblems_MC, new cjs.Rectangle(0,0.1,146.6,100.3), null);


    // stage content:
    (lib.getExportRoot = function(mode,startPosition,loop) {
        this.initialize(mode,startPosition,loop,{"in":0,out:20});

        this.instance = new lib.TechnicalProblems_MC();
        this.instance.parent = this;
        this.instance.setTransform(465,83.2,1,1,0,0,0,41,46);
        this.instance.alpha = 0;
        this.instance._off = true;

        this.timeline.addTween(cjs.Tween.get(this.instance)
            .wait(11).to({ _off: false }, 0)
            .to({ y: 53.2, alpha: 1 }, 3)
            .to({ y: 63.2 }, 2)
            //.wait(5)
            //.to({ y: 53.2 }, 2)
            //.to({ y: 83.2, alpha: 0 }, 3)
            //.wait(9)
        );

        var bb = new AnimationWithWhiteStrip(lib, img, cjs, lib.txt);
        bb.showAnimatedText(this, lib.txt);

        CommonAnimationBase.call(this, lib, img, cjs, txt);
        this.initializeFrameHandler(this);

    }).prototype = p = new cjs.MovieClip();
    p.nominalBounds = null;
    // library properties:
    lib.txt = txt;
    lib.properties = {
        width: 666,
        height: 250,
        fps: 24,
        color: "#FFFFFF",
        opacity: 1.00,
        webfonts: {},
        manifest: [],
        preloads: []
    };
}
CommonAnimation_TechnicalProblems.prototype = Object.create(CommonAnimationBase.prototype);
CommonAnimation_TechnicalProblems.prototype.constructor = CommonAnimationBase;