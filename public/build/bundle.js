
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_iframe_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
                // make sure an initial resize event is fired _after_ the iframe is loaded (which is asynchronous)
                // see https://github.com/sveltejs/svelte/issues/4233
                fn();
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop$1;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Scroller.svelte generated by Svelte v3.59.2 */
    const file$6 = "src/components/Scroller.svelte";
    const get_foreground_slot_changes = dirty => ({});
    const get_foreground_slot_context = ctx => ({});
    const get_background_slot_changes = dirty => ({});
    const get_background_slot_context = ctx => ({});

    function create_fragment$6(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let current;
    	const background_slot_template = /*#slots*/ ctx[3].background;
    	const background_slot = create_slot(background_slot_template, ctx, /*$$scope*/ ctx[2], get_background_slot_context);
    	const foreground_slot_template = /*#slots*/ ctx[3].foreground;
    	const foreground_slot = create_slot(foreground_slot_template, ctx, /*$$scope*/ ctx[2], get_foreground_slot_context);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if (background_slot) background_slot.c();
    			t = space();
    			div1 = element("div");
    			if (foreground_slot) foreground_slot.c();
    			attr_dev(div0, "class", "background svelte-1deazmv");
    			add_location(div0, file$6, 44, 2, 1235);
    			attr_dev(div1, "class", "foreground svelte-1deazmv");
    			add_location(div1, file$6, 48, 2, 1310);
    			attr_dev(div2, "class", "scroller svelte-1deazmv");
    			add_location(div2, file$6, 43, 0, 1210);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			if (background_slot) {
    				background_slot.m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (foreground_slot) {
    				foreground_slot.m(div1, null);
    			}

    			/*div1_binding*/ ctx[4](div1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (background_slot) {
    				if (background_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						background_slot,
    						background_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(background_slot_template, /*$$scope*/ ctx[2], dirty, get_background_slot_changes),
    						get_background_slot_context
    					);
    				}
    			}

    			if (foreground_slot) {
    				if (foreground_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						foreground_slot,
    						foreground_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(foreground_slot_template, /*$$scope*/ ctx[2], dirty, get_foreground_slot_changes),
    						get_foreground_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(background_slot, local);
    			transition_in(foreground_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(background_slot, local);
    			transition_out(foreground_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (background_slot) background_slot.d(detaching);
    			if (foreground_slot) foreground_slot.d(detaching);
    			/*div1_binding*/ ctx[4](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Scroller', slots, ['background','foreground']);
    	const dispatch = createEventDispatcher();
    	let { activeSection = 0 } = $$props;
    	let foreground;
    	let sections = [];
    	let containerHeight;
    	let screenHeight;

    	onMount(() => {
    		// Get all section elements
    		sections = foreground.querySelectorAll('section');

    		screenHeight = window.innerHeight;

    		// Calculate total scroll height needed
    		containerHeight = sections.length * screenHeight;

    		// Set initial container height
    		$$invalidate(0, foreground.style.height = `${containerHeight}px`, foreground);

    		// Add scroll event listener
    		window.addEventListener('scroll', handleScroll);

    		return () => {
    			window.removeEventListener('scroll', handleScroll);
    		};
    	});

    	function handleScroll() {
    		const scrollPosition = window.scrollY;

    		// Calculate which section should be active based on scroll position
    		const newActiveSection = Math.floor(scrollPosition / screenHeight);

    		if (newActiveSection !== activeSection && newActiveSection >= 0 && newActiveSection < sections.length) {
    			$$invalidate(1, activeSection = newActiveSection);
    			dispatch('sectionChange', activeSection);
    		}
    	}

    	const writable_props = ['activeSection'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Scroller> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			foreground = $$value;
    			$$invalidate(0, foreground);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('activeSection' in $$props) $$invalidate(1, activeSection = $$props.activeSection);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		dispatch,
    		activeSection,
    		foreground,
    		sections,
    		containerHeight,
    		screenHeight,
    		handleScroll
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeSection' in $$props) $$invalidate(1, activeSection = $$props.activeSection);
    		if ('foreground' in $$props) $$invalidate(0, foreground = $$props.foreground);
    		if ('sections' in $$props) sections = $$props.sections;
    		if ('containerHeight' in $$props) containerHeight = $$props.containerHeight;
    		if ('screenHeight' in $$props) screenHeight = $$props.screenHeight;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [foreground, activeSection, $$scope, slots, div1_binding];
    }

    class Scroller extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { activeSection: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scroller",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get activeSection() {
    		throw new Error("<Scroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeSection(value) {
    		throw new Error("<Scroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Section.svelte generated by Svelte v3.59.2 */

    const file$5 = "src/components/Section.svelte";

    function create_fragment$5(ctx) {
    	let section;
    	let div;
    	let h2;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let section_class_value;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*text*/ ctx[2]);
    			add_location(h2, file$5, 12, 4, 203);
    			add_location(p, file$5, 13, 4, 224);
    			attr_dev(div, "class", "content svelte-rw9avj");
    			add_location(div, file$5, 11, 2, 177);
    			attr_dev(section, "id", /*id*/ ctx[0]);
    			attr_dev(section, "class", section_class_value = "section " + (/*isActive*/ ctx[3] ? 'active' : '') + " svelte-rw9avj");
    			add_location(section, file$5, 7, 0, 107);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);
    			if (dirty & /*text*/ 4) set_data_dev(t2, /*text*/ ctx[2]);

    			if (dirty & /*id*/ 1) {
    				attr_dev(section, "id", /*id*/ ctx[0]);
    			}

    			if (dirty & /*isActive*/ 8 && section_class_value !== (section_class_value = "section " + (/*isActive*/ ctx[3] ? 'active' : '') + " svelte-rw9avj")) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section', slots, []);
    	let { id } = $$props;
    	let { title } = $$props;
    	let { text } = $$props;
    	let { isActive = false } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<Section> was created without expected prop 'id'");
    		}

    		if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
    			console.warn("<Section> was created without expected prop 'title'");
    		}

    		if (text === undefined && !('text' in $$props || $$self.$$.bound[$$self.$$.props['text']])) {
    			console.warn("<Section> was created without expected prop 'text'");
    		}
    	});

    	const writable_props = ['id', 'title', 'text', 'isActive'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Section> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    		if ('isActive' in $$props) $$invalidate(3, isActive = $$props.isActive);
    	};

    	$$self.$capture_state = () => ({ id, title, text, isActive });

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    		if ('isActive' in $$props) $$invalidate(3, isActive = $$props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, title, text, isActive];
    }

    class Section extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { id: 0, title: 1, text: 2, isActive: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get id() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isActive() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isActive(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier} [start]
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let started = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
            };
        });
    }

    /**
    	A function to help truth test values. Returns a `true` if zero.
    	@param {any} val The value to test.
    	@returns {any}
    */
    function canBeZero (val) {
    	if (val === 0) {
    		return true;
    	}
    	return val;
    }

    /**
    	Make an accessor from a string, number, function or an array of the combination of any
    	@param {String|Number|Function|Array} acc The accessor function, key or list of them.
    	@returns {Function} An accessor function.
    */
    function makeAccessor (acc) {
    	if (!canBeZero(acc)) return null;
    	if (Array.isArray(acc)) {
    		return d => acc.map(k => {
    			return typeof k !== 'function' ? d[k] : k(d);
    		});
    	} else if (typeof acc !== 'function') { // eslint-disable-line no-else-return
    		return d => d[acc];
    	}
    	return acc;
    }

    // From Object.fromEntries polyfill https://github.com/tc39/proposal-object-from-entries/blob/master/polyfill.js#L1
    function fromEntries(iter) {
    	const obj = {};

    	for (const pair of iter) {
    		if (Object(pair) !== pair) {
    			throw new TypeError("iterable for fromEntries should yield objects");
    		}
    		// Consistency with Map: contract is that entry has "0" and "1" keys, not
    		// that it is an array or iterable.
    		const { "0": key, "1": val } = pair;

    		Object.defineProperty(obj, key, {
    			configurable: true,
    			enumerable: true,
    			writable: true,
    			value: val,
    		});
    	}

    	return obj;
    }

    /**
    	Remove undefined fields from an object
    	@param {object} obj The object to filter
    	@param {object} [comparisonObj={}] An object that, for any key, if the key is not present on that object, the key will be filtered out. Note, this ignores the value on that object
    	@returns {object}
    */
    function filterObject (obj, comparisonObj = {}) {
    	return fromEntries(Object.entries(obj).filter(([key, value]) => {
    		return value !== undefined
    			&& comparisonObj[key] === undefined;
    	}));
    }

    /**
    	A simple debounce function taken from here https://www.freecodecamp.org/news/javascript-debounce-example/
    	@param {function} func The function to debounce.
    	@param {number} timeout The time in ms to wait.
    	@returns {function}
    */
    function debounce(func, timeout = 300) {
    	let timer;
    	return (...args) => {
    		clearTimeout(timer);
    		timer = setTimeout(() => {
    			func.apply(this, args);
    		}, timeout);
    	};
    }

    /**
    	Calculate the unique values of desired fields
    	For example, data like this:
    	[{ x: 0, y: -10 }, { x: 10, y: 0 }, { x: 5, y: 10 }]
    	and a fields object like this:
    	`{'x': d => d.x, 'y': d => d.y}`
    	returns an object like this:
    	`{ x: [0, 10, 5], y: [-10, 0, 10] }`
    	@param {Array} data A flat array of objects.
    	@param {{x?: Function, y?: Function, z?: Function, r?: Function}} fields An object containing `x`, `y`, `r` or `z` keys that equal an accessor function. If an accessor function returns an array of values, each value will also be evaluated..
    	@returns {{x?: [min: Number, max: Number]|[min: String, max: String], y?: [min: Number, max: Number]|[min: String, max: String], z?: [min: Number, max: Number]|[min: String, max: String], r?: [min: Number, max: Number]|[min: String, max: String]}} An object with the same structure as `fields` but instead of an accessor, each key contains an array of unique items.
    */
    function calcUniques (data, fields, { sort = false } = {}) {
    	if (!Array.isArray(data)) {
    		throw new TypeError(`The first argument of calcUniques() must be an array. You passed in a ${typeof data}. If you got this error using the <LayerCake> component, consider passing a flat array to the \`flatData\` prop. More info: https://layercake.graphics/guide/#flatdata`);
    	}

    	if (
    		Array.isArray(fields)
    		|| fields === undefined
    		|| fields === null
    	) {
    		throw new TypeError('The second argument of calcUniques() must be an '
    		+ 'object with field names as keys as accessor functions as values.');
    	}

    	const uniques = {};

    	const keys = Object.keys(fields);
    	const kl = keys.length;
    	let i;
    	let j;
    	let k;
    	let s;
    	let acc;
    	let val;
    	let set;

    	const dl = data.length;
    	for (i = 0; i < kl; i += 1) {
    		set = new Set();
    		s = keys[i];
    		acc = fields[s];
    		for (j = 0; j < dl; j += 1) {
    			val = acc(data[j]);
    			if (Array.isArray(val)) {
    				const vl = val.length;
    				for (k = 0; k < vl; k += 1) {
    					set.add(val[k]);
    				}
    			} else {
    				set.add(val);
    			}
    		}
    		const results = Array.from(set);
    		uniques[s] = sort === true ? results.sort() : results;
    	}
    	return uniques;
    }

    /**
    	Calculate the extents of desired fields, skipping `false`, `undefined`, `null` and `NaN` values
    	For example, data like this:
    	[{ x: 0, y: -10 }, { x: 10, y: 0 }, { x: 5, y: 10 }]
    	and a fields object like this:
    	`{'x': d => d.x, 'y': d => d.y}`
    	returns an object like this:
    	`{ x: [0, 10], y: [-10, 10] }`
    	@param {Array} data A flat array of objects.
    	@param {{x?: Function, y?: Function, z?: Function, r?: Function}} fields An object containing `x`, `y`, `r` or `z` keys that equal an accessor function. If an accessor function returns an array of values, each value will also be evaluated.
    	@returns {{x?: [min: Number, max: Number]|[min: String, max: String], y?: [min: Number, max: Number]|[min: String, max: String], z?: [min: Number, max: Number]|[min: String, max: String], r?: [min: Number, max: Number]|[min: String, max: String]}} An object with the same structure as `fields` but instead of an accessor, each key contains an array of a min and a max.
    */
    function calcExtents (data, fields) {
    	if (!Array.isArray(data)) {
    		throw new TypeError(`The first argument of calcExtents() must be an array. You passed in a ${typeof data}. If you got this error using the <LayerCake> component, consider passing a flat array to the \`flatData\` prop. More info: https://layercake.graphics/guide/#flatdata`);
    	}

    	if (
    		Array.isArray(fields)
    		|| fields === undefined
    		|| fields === null
    	) {
    		throw new TypeError('The second argument of calcExtents() must be an '
    		+ 'object with field names as keys as accessor functions as values.');
    	}

    	const extents = {};

    	const keys = Object.keys(fields);
    	const kl = keys.length;
    	let i;
    	let j;
    	let k;
    	let s;
    	let min;
    	let max;
    	let acc;
    	let val;

    	const dl = data.length;
    	for (i = 0; i < kl; i += 1) {
    		s = keys[i];
    		acc = fields[s];
    		min = null;
    		max = null;
    		for (j = 0; j < dl; j += 1) {
    			val = acc(data[j]);
    			if (Array.isArray(val)) {
    				const vl = val.length;
    				for (k = 0; k < vl; k += 1) {
    					if (val[k] !== false && val[k] !== undefined && val[k] !== null && Number.isNaN(val[k]) === false) {
    						if (min === null || val[k] < min) {
    							min = val[k];
    						}
    						if (max === null || val[k] > max) {
    							max = val[k];
    						}
    					}
    				}
    			} else if (val !== false && val !== undefined && val !== null && Number.isNaN(val) === false) {
    				if (min === null || val < min) {
    					min = val;
    				}
    				if (max === null || val > max) {
    					max = val;
    				}
    			}
    		}
    		extents[s] = [min, max];
    	}

    	return extents;
    }

    /**
      Determine whether two arrays equal one another, order not important.
    	This uses includes instead of converting to a set because this is only
    	used internally on a small array size and it's not worth the cost
    	of making a set
    	@param {Array} arr1 An array to test
    	@param {Array} arr2 An array to test against
    	@returns {Boolean} Whether they contain all and only the same items
     */
    function arraysEqual(arr1, arr2) {
    	if (arr1.length !== arr2.length) return false;
    	return arr1.every(k => {
    		return arr2.includes(k);
    	});
    }

    /**
      Determine whether a scale has an ordinal domain
    	https://svelte.dev/repl/ec6491055208401ca41120c9c8a67737?version=3.49.0
    	@param {Function} scale A D3 scale
    	@returns {Boolean} Whether the scale is an ordinal scale
     */
    function isOrdinalDomain(scale) {
    	// scaleBand, scalePoint
    	// @ts-ignore
    	if (typeof scale.bandwidth === 'function') {
    		return true;
    	}
    	// scaleOrdinal
    	if (arraysEqual(Object.keys(scale), ['domain', 'range', 'unknown', 'copy'])) {
    		return true;
    	}
    	return false;
    }

    /* --------------------------------------------
     * Figure out which of our scales are ordinal
     * and calculate unique items for them
     * for the others, calculate an extent
     */
    function calcScaleExtents (flatData, getters, activeScales) {
    	const scaleGroups = Object.keys(activeScales).reduce((groups, k) => {
    		const domainType = isOrdinalDomain(activeScales[k]) === true ? 'ordinal' : 'other';
    		// @ts-ignore
    		if (!groups[domainType]) groups[domainType] = {};
    		groups[domainType][k] = getters[k];
    		return groups;
    	}, { ordinal: false, other: false});

    	let extents = {};
    	if (scaleGroups.ordinal) {
    		// @ts-ignore
    		extents = calcUniques(flatData, scaleGroups.ordinal);
    	}
    	if (scaleGroups.other) {
    		// @ts-ignore
    		extents = { ...extents, ...calcExtents(flatData, scaleGroups.other) };
    	}

    	return extents;
    }

    /**
    	If we have a domain from settings (the directive), fill in
    	any null values with ones from our measured extents
    	otherwise, return the measured extent
    	@param {Number[]} domain A two-value array of numbers
    	@param {Number[]} directive A two-value array of numbers that will have any nulls filled in from the `domain` array
    	@returns {Number[]} The filled in domain
    */
    function partialDomain (domain = [], directive) {
    	if (Array.isArray(directive) === true) {
    		return directive.map((d, i) => {
    			if (d === null) {
    				return domain[i];
    			}
    			return d;
    		});
    	}
    	return domain;
    }

    function calcDomain (s) {
    	return function domainCalc ([$extents, $domain]) {
    		if (typeof $domain === 'function') {
    			$domain = $domain($extents[s]);
    		}
    		return $extents ? partialDomain($extents[s], $domain) : $domain;
    	};
    }

    function ascending(a, b) {
      return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function descending(a, b) {
      return a == null || b == null ? NaN
        : b < a ? -1
        : b > a ? 1
        : b >= a ? 0
        : NaN;
    }

    function bisector(f) {
      let compare1, compare2, delta;

      // If an accessor is specified, promote it to a comparator. In this case we
      // can test whether the search value is (self-) comparable. We can’t do this
      // for a comparator (except for specific, known comparators) because we can’t
      // tell if the comparator is symmetric, and an asymmetric comparator can’t be
      // used to test whether a single value is comparable.
      if (f.length !== 2) {
        compare1 = ascending;
        compare2 = (d, x) => ascending(f(d), x);
        delta = (d, x) => f(d) - x;
      } else {
        compare1 = f === ascending || f === descending ? f : zero$1;
        compare2 = f;
        delta = f;
      }

      function left(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
          if (compare1(x, x) !== 0) return hi;
          do {
            const mid = (lo + hi) >>> 1;
            if (compare2(a[mid], x) < 0) lo = mid + 1;
            else hi = mid;
          } while (lo < hi);
        }
        return lo;
      }

      function right(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
          if (compare1(x, x) !== 0) return hi;
          do {
            const mid = (lo + hi) >>> 1;
            if (compare2(a[mid], x) <= 0) lo = mid + 1;
            else hi = mid;
          } while (lo < hi);
        }
        return lo;
      }

      function center(a, x, lo = 0, hi = a.length) {
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function zero$1() {
      return 0;
    }

    function number$1(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect = bisector(ascending);
    const bisectRight = ascendingBisect.right;
    bisector(number$1).center;

    const e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function tickSpec(start, stop, count) {
      const step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log10(step)),
          error = step / Math.pow(10, power),
          factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
      let i1, i2, inc;
      if (power < 0) {
        inc = Math.pow(10, -power) / factor;
        i1 = Math.round(start * inc);
        i2 = Math.round(stop * inc);
        if (i1 / inc < start) ++i1;
        if (i2 / inc > stop) --i2;
        inc = -inc;
      } else {
        inc = Math.pow(10, power) * factor;
        i1 = Math.round(start / inc);
        i2 = Math.round(stop / inc);
        if (i1 * inc < start) ++i1;
        if (i2 * inc > stop) --i2;
      }
      if (i2 < i1 && 0.5 <= count && count < 2) return tickSpec(start, stop, count * 2);
      return [i1, i2, inc];
    }

    function ticks(start, stop, count) {
      stop = +stop, start = +start, count = +count;
      if (!(count > 0)) return [];
      if (start === stop) return [start];
      const reverse = stop < start, [i1, i2, inc] = reverse ? tickSpec(stop, start, count) : tickSpec(start, stop, count);
      if (!(i2 >= i1)) return [];
      const n = i2 - i1 + 1, ticks = new Array(n);
      if (reverse) {
        if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) / -inc;
        else for (let i = 0; i < n; ++i) ticks[i] = (i2 - i) * inc;
      } else {
        if (inc < 0) for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) / -inc;
        else for (let i = 0; i < n; ++i) ticks[i] = (i1 + i) * inc;
      }
      return ticks;
    }

    function tickIncrement(start, stop, count) {
      stop = +stop, start = +start, count = +count;
      return tickSpec(start, stop, count)[2];
    }

    function tickStep(start, stop, count) {
      stop = +stop, start = +start, count = +count;
      const reverse = stop < start, inc = reverse ? tickIncrement(stop, start, count) : tickIncrement(start, stop, count);
      return (reverse ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
        reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
        reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
        reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
        reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
        reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHex8: color_formatHex8,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHex8() {
      return this.rgb().formatHex8();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb$1(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb$1, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb() {
        return this;
      },
      clamp() {
        return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
      },
      displayable() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatHex8: rgb_formatHex8,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
    }

    function rgb_formatHex8() {
      return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
    }

    function rgb_formatRgb() {
      const a = clampa(this.opacity);
      return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
    }

    function clampa(opacity) {
      return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
    }

    function clampi(value) {
      return Math.max(0, Math.min(255, Math.round(value) || 0));
    }

    function hex(value) {
      value = clampi(value);
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      clamp() {
        return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
      },
      displayable() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl() {
        const a = clampa(this.opacity);
        return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
      }
    }));

    function clamph(value) {
      value = (value || 0) % 360;
      return value < 0 ? value + 360 : value;
    }

    function clampt(value) {
      return Math.max(0, Math.min(1, value || 0));
    }

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    const radians = Math.PI / 180;
    const degrees = 180 / Math.PI;

    // https://observablehq.com/@mbostock/lab-and-rgb
    const K = 18,
        Xn = 0.96422,
        Yn = 1,
        Zn = 0.82521,
        t0$1 = 4 / 29,
        t1$1 = 6 / 29,
        t2 = 3 * t1$1 * t1$1,
        t3 = t1$1 * t1$1 * t1$1;

    function labConvert(o) {
      if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
      if (o instanceof Hcl) return hcl2lab(o);
      if (!(o instanceof Rgb)) o = rgbConvert(o);
      var r = rgb2lrgb(o.r),
          g = rgb2lrgb(o.g),
          b = rgb2lrgb(o.b),
          y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
      if (r === g && g === b) x = z = y; else {
        x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
        z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
      }
      return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
    }

    function lab(l, a, b, opacity) {
      return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
    }

    function Lab(l, a, b, opacity) {
      this.l = +l;
      this.a = +a;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Lab, lab, extend(Color, {
      brighter(k) {
        return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
      },
      darker(k) {
        return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
      },
      rgb() {
        var y = (this.l + 16) / 116,
            x = isNaN(this.a) ? y : y + this.a / 500,
            z = isNaN(this.b) ? y : y - this.b / 200;
        x = Xn * lab2xyz(x);
        y = Yn * lab2xyz(y);
        z = Zn * lab2xyz(z);
        return new Rgb(
          lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
          lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
          lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
          this.opacity
        );
      }
    }));

    function xyz2lab(t) {
      return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0$1;
    }

    function lab2xyz(t) {
      return t > t1$1 ? t * t * t : t2 * (t - t0$1);
    }

    function lrgb2rgb(x) {
      return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
    }

    function rgb2lrgb(x) {
      return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }

    function hclConvert(o) {
      if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
      if (!(o instanceof Lab)) o = labConvert(o);
      if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
      var h = Math.atan2(o.b, o.a) * degrees;
      return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
    }

    function hcl(h, c, l, opacity) {
      return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
    }

    function Hcl(h, c, l, opacity) {
      this.h = +h;
      this.c = +c;
      this.l = +l;
      this.opacity = +opacity;
    }

    function hcl2lab(o) {
      if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
      var h = o.h * radians;
      return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    }

    define(Hcl, hcl, extend(Color, {
      brighter(k) {
        return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
      },
      darker(k) {
        return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
      },
      rgb() {
        return hcl2lab(this).rgb();
      }
    }));

    var A = -0.14861,
        B = +1.78277,
        C = -0.29227,
        D = -0.90649,
        E = +1.97294,
        ED = E * D,
        EB = E * B,
        BC_DA = B * C - D * A;

    function cubehelixConvert(o) {
      if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Rgb)) o = rgbConvert(o);
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
          bl = b - l,
          k = (E * (g - l) - C * bl) / D,
          s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
          h = s ? Math.atan2(k, bl) * degrees - 120 : NaN;
      return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
    }

    function cubehelix$1(h, s, l, opacity) {
      return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
    }

    function Cubehelix(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Cubehelix, cubehelix$1, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
      },
      rgb() {
        var h = isNaN(this.h) ? 0 : (this.h + 120) * radians,
            l = +this.l,
            a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
            cosh = Math.cos(h),
            sinh = Math.sin(h);
        return new Rgb(
          255 * (l + a * (A * cosh + B * sinh)),
          255 * (l + a * (C * cosh + D * sinh)),
          255 * (l + a * (E * cosh)),
          this.opacity
        );
      }
    }));

    var constant = x => () => x;

    function linear$1(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function hue(a, b) {
      var d = b - a;
      return d ? linear$1(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant(isNaN(a) ? b : a);
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$1(a, d) : constant(isNaN(a) ? b : a);
    }

    var rgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb(start, end) {
        var r = color((start = rgb$1(start)).r, (end = rgb$1(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
          : b instanceof color ? rgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    var epsilon2 = 1e-12;

    function cosh(x) {
      return ((x = Math.exp(x)) + 1 / x) / 2;
    }

    function sinh(x) {
      return ((x = Math.exp(x)) - 1 / x) / 2;
    }

    function tanh(x) {
      return ((x = Math.exp(2 * x)) - 1) / (x + 1);
    }

    ((function zoomRho(rho, rho2, rho4) {

      // p0 = [ux0, uy0, w0]
      // p1 = [ux1, uy1, w1]
      function zoom(p0, p1) {
        var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
            ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
            dx = ux1 - ux0,
            dy = uy1 - uy0,
            d2 = dx * dx + dy * dy,
            i,
            S;

        // Special case for u0 ≅ u1.
        if (d2 < epsilon2) {
          S = Math.log(w1 / w0) / rho;
          i = function(t) {
            return [
              ux0 + t * dx,
              uy0 + t * dy,
              w0 * Math.exp(rho * t * S)
            ];
          };
        }

        // General case.
        else {
          var d1 = Math.sqrt(d2),
              b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
              b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
              r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
              r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
          S = (r1 - r0) / rho;
          i = function(t) {
            var s = t * S,
                coshr0 = cosh(r0),
                u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
            return [
              ux0 + u * dx,
              uy0 + u * dy,
              w0 * coshr0 / cosh(rho * s + r0)
            ];
          };
        }

        i.duration = S * 1000 * rho / Math.SQRT2;

        return i;
      }

      zoom.rho = function(_) {
        var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
        return zoomRho(_1, _2, _4);
      };

      return zoom;
    }))(Math.SQRT2, 2, 4);

    function cubehelix(hue) {
      return (function cubehelixGamma(y) {
        y = +y;

        function cubehelix(start, end) {
          var h = hue((start = cubehelix$1(start)).h, (end = cubehelix$1(end)).h),
              s = nogamma(start.s, end.s),
              l = nogamma(start.l, end.l),
              opacity = nogamma(start.opacity, end.opacity);
          return function(t) {
            start.h = h(t);
            start.s = s(t);
            start.l = l(Math.pow(t, y));
            start.opacity = opacity(t);
            return start + "";
          };
        }

        cubehelix.gamma = cubehelixGamma;

        return cubehelix;
      })(1);
    }

    cubehelix(hue);
    cubehelix(nogamma);

    function constants(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity$2(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants(isNaN(b) ? NaN : 0.5);
    }

    function clamper(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisectRight(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate$1 = interpolate,
          transform,
          untransform,
          unknown,
          clamp = identity$2,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity$2) clamp = clamper(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity$2, rescale()) : clamp !== identity$2;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous() {
      return transformer()(identity$2, identity$2);
    }

    function formatDecimal(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded(x * 100, p),
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity$1(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale$1(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity$1 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity$1 : formatNumerals(map.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale$1;
    var format;
    var formatPrefix;

    defaultLocale$1({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale$1(definition) {
      locale$1 = formatLocale$1(definition);
      format = locale$1.format;
      formatPrefix = locale$1.formatPrefix;
      return locale$1;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function linear() {
      var scale = continuous();

      scale.copy = function() {
        return copy(scale, linear());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    function transformPow(exponent) {
      return function(x) {
        return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
      };
    }

    function transformSqrt(x) {
      return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
    }

    function transformSquare(x) {
      return x < 0 ? -x * x : x * x;
    }

    function powish(transform) {
      var scale = transform(identity$2, identity$2),
          exponent = 1;

      function rescale() {
        return exponent === 1 ? transform(identity$2, identity$2)
            : exponent === 0.5 ? transform(transformSqrt, transformSquare)
            : transform(transformPow(exponent), transformPow(1 / exponent));
      }

      scale.exponent = function(_) {
        return arguments.length ? (exponent = +_, rescale()) : exponent;
      };

      return linearish(scale);
    }

    function pow$1() {
      var scale = powish(transformer());

      scale.copy = function() {
        return copy(scale, pow$1()).exponent(scale.exponent());
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function sqrt() {
      return pow$1.apply(null, arguments).exponent(0.5);
    }

    const t0 = new Date, t1 = new Date;

    function timeInterval(floori, offseti, count, field) {

      function interval(date) {
        return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
      }

      interval.floor = (date) => {
        return floori(date = new Date(+date)), date;
      };

      interval.ceil = (date) => {
        return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
      };

      interval.round = (date) => {
        const d0 = interval(date), d1 = interval.ceil(date);
        return date - d0 < d1 - date ? d0 : d1;
      };

      interval.offset = (date, step) => {
        return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
      };

      interval.range = (start, stop, step) => {
        const range = [];
        start = interval.ceil(start);
        step = step == null ? 1 : Math.floor(step);
        if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
        let previous;
        do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
        while (previous < start && start < stop);
        return range;
      };

      interval.filter = (test) => {
        return timeInterval((date) => {
          if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
        }, (date, step) => {
          if (date >= date) {
            if (step < 0) while (++step <= 0) {
              while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
            } else while (--step >= 0) {
              while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
            }
          }
        });
      };

      if (count) {
        interval.count = (start, end) => {
          t0.setTime(+start), t1.setTime(+end);
          floori(t0), floori(t1);
          return Math.floor(count(t0, t1));
        };

        interval.every = (step) => {
          step = Math.floor(step);
          return !isFinite(step) || !(step > 0) ? null
              : !(step > 1) ? interval
              : interval.filter(field
                  ? (d) => field(d) % step === 0
                  : (d) => interval.count(0, d) % step === 0);
        };
      }

      return interval;
    }

    const millisecond = timeInterval(() => {
      // noop
    }, (date, step) => {
      date.setTime(+date + step);
    }, (start, end) => {
      return end - start;
    });

    // An optimized implementation for this simple case.
    millisecond.every = (k) => {
      k = Math.floor(k);
      if (!isFinite(k) || !(k > 0)) return null;
      if (!(k > 1)) return millisecond;
      return timeInterval((date) => {
        date.setTime(Math.floor(date / k) * k);
      }, (date, step) => {
        date.setTime(+date + step * k);
      }, (start, end) => {
        return (end - start) / k;
      });
    };

    millisecond.range;

    const durationSecond = 1000;
    const durationMinute = durationSecond * 60;
    const durationHour = durationMinute * 60;
    const durationDay = durationHour * 24;
    const durationWeek = durationDay * 7;

    const second = timeInterval((date) => {
      date.setTime(date - date.getMilliseconds());
    }, (date, step) => {
      date.setTime(+date + step * durationSecond);
    }, (start, end) => {
      return (end - start) / durationSecond;
    }, (date) => {
      return date.getUTCSeconds();
    });

    second.range;

    const timeMinute = timeInterval((date) => {
      date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
    }, (date, step) => {
      date.setTime(+date + step * durationMinute);
    }, (start, end) => {
      return (end - start) / durationMinute;
    }, (date) => {
      return date.getMinutes();
    });

    timeMinute.range;

    const utcMinute = timeInterval((date) => {
      date.setUTCSeconds(0, 0);
    }, (date, step) => {
      date.setTime(+date + step * durationMinute);
    }, (start, end) => {
      return (end - start) / durationMinute;
    }, (date) => {
      return date.getUTCMinutes();
    });

    utcMinute.range;

    const timeHour = timeInterval((date) => {
      date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
    }, (date, step) => {
      date.setTime(+date + step * durationHour);
    }, (start, end) => {
      return (end - start) / durationHour;
    }, (date) => {
      return date.getHours();
    });

    timeHour.range;

    const utcHour = timeInterval((date) => {
      date.setUTCMinutes(0, 0, 0);
    }, (date, step) => {
      date.setTime(+date + step * durationHour);
    }, (start, end) => {
      return (end - start) / durationHour;
    }, (date) => {
      return date.getUTCHours();
    });

    utcHour.range;

    const timeDay = timeInterval(
      date => date.setHours(0, 0, 0, 0),
      (date, step) => date.setDate(date.getDate() + step),
      (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay,
      date => date.getDate() - 1
    );

    timeDay.range;

    const utcDay = timeInterval((date) => {
      date.setUTCHours(0, 0, 0, 0);
    }, (date, step) => {
      date.setUTCDate(date.getUTCDate() + step);
    }, (start, end) => {
      return (end - start) / durationDay;
    }, (date) => {
      return date.getUTCDate() - 1;
    });

    utcDay.range;

    const unixDay = timeInterval((date) => {
      date.setUTCHours(0, 0, 0, 0);
    }, (date, step) => {
      date.setUTCDate(date.getUTCDate() + step);
    }, (start, end) => {
      return (end - start) / durationDay;
    }, (date) => {
      return Math.floor(date / durationDay);
    });

    unixDay.range;

    function timeWeekday(i) {
      return timeInterval((date) => {
        date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
        date.setHours(0, 0, 0, 0);
      }, (date, step) => {
        date.setDate(date.getDate() + step * 7);
      }, (start, end) => {
        return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
      });
    }

    const timeSunday = timeWeekday(0);
    const timeMonday = timeWeekday(1);
    const timeTuesday = timeWeekday(2);
    const timeWednesday = timeWeekday(3);
    const timeThursday = timeWeekday(4);
    const timeFriday = timeWeekday(5);
    const timeSaturday = timeWeekday(6);

    timeSunday.range;
    timeMonday.range;
    timeTuesday.range;
    timeWednesday.range;
    timeThursday.range;
    timeFriday.range;
    timeSaturday.range;

    function utcWeekday(i) {
      return timeInterval((date) => {
        date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
        date.setUTCHours(0, 0, 0, 0);
      }, (date, step) => {
        date.setUTCDate(date.getUTCDate() + step * 7);
      }, (start, end) => {
        return (end - start) / durationWeek;
      });
    }

    const utcSunday = utcWeekday(0);
    const utcMonday = utcWeekday(1);
    const utcTuesday = utcWeekday(2);
    const utcWednesday = utcWeekday(3);
    const utcThursday = utcWeekday(4);
    const utcFriday = utcWeekday(5);
    const utcSaturday = utcWeekday(6);

    utcSunday.range;
    utcMonday.range;
    utcTuesday.range;
    utcWednesday.range;
    utcThursday.range;
    utcFriday.range;
    utcSaturday.range;

    const timeMonth = timeInterval((date) => {
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
    }, (date, step) => {
      date.setMonth(date.getMonth() + step);
    }, (start, end) => {
      return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
    }, (date) => {
      return date.getMonth();
    });

    timeMonth.range;

    const utcMonth = timeInterval((date) => {
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
    }, (date, step) => {
      date.setUTCMonth(date.getUTCMonth() + step);
    }, (start, end) => {
      return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
    }, (date) => {
      return date.getUTCMonth();
    });

    utcMonth.range;

    const timeYear = timeInterval((date) => {
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, (date, step) => {
      date.setFullYear(date.getFullYear() + step);
    }, (start, end) => {
      return end.getFullYear() - start.getFullYear();
    }, (date) => {
      return date.getFullYear();
    });

    // An optimized implementation for this simple case.
    timeYear.every = (k) => {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : timeInterval((date) => {
        date.setFullYear(Math.floor(date.getFullYear() / k) * k);
        date.setMonth(0, 1);
        date.setHours(0, 0, 0, 0);
      }, (date, step) => {
        date.setFullYear(date.getFullYear() + step * k);
      });
    };

    timeYear.range;

    const utcYear = timeInterval((date) => {
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, (date, step) => {
      date.setUTCFullYear(date.getUTCFullYear() + step);
    }, (start, end) => {
      return end.getUTCFullYear() - start.getUTCFullYear();
    }, (date) => {
      return date.getUTCFullYear();
    });

    // An optimized implementation for this simple case.
    utcYear.every = (k) => {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : timeInterval((date) => {
        date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
        date.setUTCMonth(0, 1);
        date.setUTCHours(0, 0, 0, 0);
      }, (date, step) => {
        date.setUTCFullYear(date.getUTCFullYear() + step * k);
      });
    };

    utcYear.range;

    function localDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
        date.setFullYear(d.y);
        return date;
      }
      return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
    }

    function utcDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
        date.setUTCFullYear(d.y);
        return date;
      }
      return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
    }

    function newDate(y, m, d) {
      return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
    }

    function formatLocale(locale) {
      var locale_dateTime = locale.dateTime,
          locale_date = locale.date,
          locale_time = locale.time,
          locale_periods = locale.periods,
          locale_weekdays = locale.days,
          locale_shortWeekdays = locale.shortDays,
          locale_months = locale.months,
          locale_shortMonths = locale.shortMonths;

      var periodRe = formatRe(locale_periods),
          periodLookup = formatLookup(locale_periods),
          weekdayRe = formatRe(locale_weekdays),
          weekdayLookup = formatLookup(locale_weekdays),
          shortWeekdayRe = formatRe(locale_shortWeekdays),
          shortWeekdayLookup = formatLookup(locale_shortWeekdays),
          monthRe = formatRe(locale_months),
          monthLookup = formatLookup(locale_months),
          shortMonthRe = formatRe(locale_shortMonths),
          shortMonthLookup = formatLookup(locale_shortMonths);

      var formats = {
        "a": formatShortWeekday,
        "A": formatWeekday,
        "b": formatShortMonth,
        "B": formatMonth,
        "c": null,
        "d": formatDayOfMonth,
        "e": formatDayOfMonth,
        "f": formatMicroseconds,
        "g": formatYearISO,
        "G": formatFullYearISO,
        "H": formatHour24,
        "I": formatHour12,
        "j": formatDayOfYear,
        "L": formatMilliseconds,
        "m": formatMonthNumber,
        "M": formatMinutes,
        "p": formatPeriod,
        "q": formatQuarter,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatSeconds,
        "u": formatWeekdayNumberMonday,
        "U": formatWeekNumberSunday,
        "V": formatWeekNumberISO,
        "w": formatWeekdayNumberSunday,
        "W": formatWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatYear,
        "Y": formatFullYear,
        "Z": formatZone,
        "%": formatLiteralPercent
      };

      var utcFormats = {
        "a": formatUTCShortWeekday,
        "A": formatUTCWeekday,
        "b": formatUTCShortMonth,
        "B": formatUTCMonth,
        "c": null,
        "d": formatUTCDayOfMonth,
        "e": formatUTCDayOfMonth,
        "f": formatUTCMicroseconds,
        "g": formatUTCYearISO,
        "G": formatUTCFullYearISO,
        "H": formatUTCHour24,
        "I": formatUTCHour12,
        "j": formatUTCDayOfYear,
        "L": formatUTCMilliseconds,
        "m": formatUTCMonthNumber,
        "M": formatUTCMinutes,
        "p": formatUTCPeriod,
        "q": formatUTCQuarter,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatUTCSeconds,
        "u": formatUTCWeekdayNumberMonday,
        "U": formatUTCWeekNumberSunday,
        "V": formatUTCWeekNumberISO,
        "w": formatUTCWeekdayNumberSunday,
        "W": formatUTCWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatUTCYear,
        "Y": formatUTCFullYear,
        "Z": formatUTCZone,
        "%": formatLiteralPercent
      };

      var parses = {
        "a": parseShortWeekday,
        "A": parseWeekday,
        "b": parseShortMonth,
        "B": parseMonth,
        "c": parseLocaleDateTime,
        "d": parseDayOfMonth,
        "e": parseDayOfMonth,
        "f": parseMicroseconds,
        "g": parseYear,
        "G": parseFullYear,
        "H": parseHour24,
        "I": parseHour24,
        "j": parseDayOfYear,
        "L": parseMilliseconds,
        "m": parseMonthNumber,
        "M": parseMinutes,
        "p": parsePeriod,
        "q": parseQuarter,
        "Q": parseUnixTimestamp,
        "s": parseUnixTimestampSeconds,
        "S": parseSeconds,
        "u": parseWeekdayNumberMonday,
        "U": parseWeekNumberSunday,
        "V": parseWeekNumberISO,
        "w": parseWeekdayNumberSunday,
        "W": parseWeekNumberMonday,
        "x": parseLocaleDate,
        "X": parseLocaleTime,
        "y": parseYear,
        "Y": parseFullYear,
        "Z": parseZone,
        "%": parseLiteralPercent
      };

      // These recursive directive definitions must be deferred.
      formats.x = newFormat(locale_date, formats);
      formats.X = newFormat(locale_time, formats);
      formats.c = newFormat(locale_dateTime, formats);
      utcFormats.x = newFormat(locale_date, utcFormats);
      utcFormats.X = newFormat(locale_time, utcFormats);
      utcFormats.c = newFormat(locale_dateTime, utcFormats);

      function newFormat(specifier, formats) {
        return function(date) {
          var string = [],
              i = -1,
              j = 0,
              n = specifier.length,
              c,
              pad,
              format;

          if (!(date instanceof Date)) date = new Date(+date);

          while (++i < n) {
            if (specifier.charCodeAt(i) === 37) {
              string.push(specifier.slice(j, i));
              if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
              else pad = c === "e" ? " " : "0";
              if (format = formats[c]) c = format(date, pad);
              string.push(c);
              j = i + 1;
            }
          }

          string.push(specifier.slice(j, i));
          return string.join("");
        };
      }

      function newParse(specifier, Z) {
        return function(string) {
          var d = newDate(1900, undefined, 1),
              i = parseSpecifier(d, specifier, string += "", 0),
              week, day;
          if (i != string.length) return null;

          // If a UNIX timestamp is specified, return it.
          if ("Q" in d) return new Date(d.Q);
          if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

          // If this is utcParse, never use the local timezone.
          if (Z && !("Z" in d)) d.Z = 0;

          // The am-pm flag is 0 for AM, and 1 for PM.
          if ("p" in d) d.H = d.H % 12 + d.p * 12;

          // If the month was not specified, inherit from the quarter.
          if (d.m === undefined) d.m = "q" in d ? d.q : 0;

          // Convert day-of-week and week-of-year to day-of-year.
          if ("V" in d) {
            if (d.V < 1 || d.V > 53) return null;
            if (!("w" in d)) d.w = 1;
            if ("Z" in d) {
              week = utcDate(newDate(d.y, 0, 1)), day = week.getUTCDay();
              week = day > 4 || day === 0 ? utcMonday.ceil(week) : utcMonday(week);
              week = utcDay.offset(week, (d.V - 1) * 7);
              d.y = week.getUTCFullYear();
              d.m = week.getUTCMonth();
              d.d = week.getUTCDate() + (d.w + 6) % 7;
            } else {
              week = localDate(newDate(d.y, 0, 1)), day = week.getDay();
              week = day > 4 || day === 0 ? timeMonday.ceil(week) : timeMonday(week);
              week = timeDay.offset(week, (d.V - 1) * 7);
              d.y = week.getFullYear();
              d.m = week.getMonth();
              d.d = week.getDate() + (d.w + 6) % 7;
            }
          } else if ("W" in d || "U" in d) {
            if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
            day = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
            d.m = 0;
            d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
          }

          // If a time zone is specified, all fields are interpreted as UTC and then
          // offset according to the specified time zone.
          if ("Z" in d) {
            d.H += d.Z / 100 | 0;
            d.M += d.Z % 100;
            return utcDate(d);
          }

          // Otherwise, all fields are in local time.
          return localDate(d);
        };
      }

      function parseSpecifier(d, specifier, string, j) {
        var i = 0,
            n = specifier.length,
            m = string.length,
            c,
            parse;

        while (i < n) {
          if (j >= m) return -1;
          c = specifier.charCodeAt(i++);
          if (c === 37) {
            c = specifier.charAt(i++);
            parse = parses[c in pads ? specifier.charAt(i++) : c];
            if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
          } else if (c != string.charCodeAt(j++)) {
            return -1;
          }
        }

        return j;
      }

      function parsePeriod(d, string, i) {
        var n = periodRe.exec(string.slice(i));
        return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseShortWeekday(d, string, i) {
        var n = shortWeekdayRe.exec(string.slice(i));
        return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseWeekday(d, string, i) {
        var n = weekdayRe.exec(string.slice(i));
        return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseShortMonth(d, string, i) {
        var n = shortMonthRe.exec(string.slice(i));
        return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseMonth(d, string, i) {
        var n = monthRe.exec(string.slice(i));
        return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseLocaleDateTime(d, string, i) {
        return parseSpecifier(d, locale_dateTime, string, i);
      }

      function parseLocaleDate(d, string, i) {
        return parseSpecifier(d, locale_date, string, i);
      }

      function parseLocaleTime(d, string, i) {
        return parseSpecifier(d, locale_time, string, i);
      }

      function formatShortWeekday(d) {
        return locale_shortWeekdays[d.getDay()];
      }

      function formatWeekday(d) {
        return locale_weekdays[d.getDay()];
      }

      function formatShortMonth(d) {
        return locale_shortMonths[d.getMonth()];
      }

      function formatMonth(d) {
        return locale_months[d.getMonth()];
      }

      function formatPeriod(d) {
        return locale_periods[+(d.getHours() >= 12)];
      }

      function formatQuarter(d) {
        return 1 + ~~(d.getMonth() / 3);
      }

      function formatUTCShortWeekday(d) {
        return locale_shortWeekdays[d.getUTCDay()];
      }

      function formatUTCWeekday(d) {
        return locale_weekdays[d.getUTCDay()];
      }

      function formatUTCShortMonth(d) {
        return locale_shortMonths[d.getUTCMonth()];
      }

      function formatUTCMonth(d) {
        return locale_months[d.getUTCMonth()];
      }

      function formatUTCPeriod(d) {
        return locale_periods[+(d.getUTCHours() >= 12)];
      }

      function formatUTCQuarter(d) {
        return 1 + ~~(d.getUTCMonth() / 3);
      }

      return {
        format: function(specifier) {
          var f = newFormat(specifier += "", formats);
          f.toString = function() { return specifier; };
          return f;
        },
        parse: function(specifier) {
          var p = newParse(specifier += "", false);
          p.toString = function() { return specifier; };
          return p;
        },
        utcFormat: function(specifier) {
          var f = newFormat(specifier += "", utcFormats);
          f.toString = function() { return specifier; };
          return f;
        },
        utcParse: function(specifier) {
          var p = newParse(specifier += "", true);
          p.toString = function() { return specifier; };
          return p;
        }
      };
    }

    var pads = {"-": "", "_": " ", "0": "0"},
        numberRe = /^\s*\d+/, // note: ignores next directive
        percentRe = /^%/,
        requoteRe = /[\\^$*+?|[\]().{}]/g;

    function pad(value, fill, width) {
      var sign = value < 0 ? "-" : "",
          string = (sign ? -value : value) + "",
          length = string.length;
      return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
    }

    function requote(s) {
      return s.replace(requoteRe, "\\$&");
    }

    function formatRe(names) {
      return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
    }

    function formatLookup(names) {
      return new Map(names.map((name, i) => [name.toLowerCase(), i]));
    }

    function parseWeekdayNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.w = +n[0], i + n[0].length) : -1;
    }

    function parseWeekdayNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.u = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.U = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberISO(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.V = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.W = +n[0], i + n[0].length) : -1;
    }

    function parseFullYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 4));
      return n ? (d.y = +n[0], i + n[0].length) : -1;
    }

    function parseYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
    }

    function parseZone(d, string, i) {
      var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
      return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
    }

    function parseQuarter(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
    }

    function parseMonthNumber(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
    }

    function parseDayOfMonth(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.d = +n[0], i + n[0].length) : -1;
    }

    function parseDayOfYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
    }

    function parseHour24(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.H = +n[0], i + n[0].length) : -1;
    }

    function parseMinutes(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.M = +n[0], i + n[0].length) : -1;
    }

    function parseSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.S = +n[0], i + n[0].length) : -1;
    }

    function parseMilliseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.L = +n[0], i + n[0].length) : -1;
    }

    function parseMicroseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 6));
      return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
    }

    function parseLiteralPercent(d, string, i) {
      var n = percentRe.exec(string.slice(i, i + 1));
      return n ? i + n[0].length : -1;
    }

    function parseUnixTimestamp(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.Q = +n[0], i + n[0].length) : -1;
    }

    function parseUnixTimestampSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.s = +n[0], i + n[0].length) : -1;
    }

    function formatDayOfMonth(d, p) {
      return pad(d.getDate(), p, 2);
    }

    function formatHour24(d, p) {
      return pad(d.getHours(), p, 2);
    }

    function formatHour12(d, p) {
      return pad(d.getHours() % 12 || 12, p, 2);
    }

    function formatDayOfYear(d, p) {
      return pad(1 + timeDay.count(timeYear(d), d), p, 3);
    }

    function formatMilliseconds(d, p) {
      return pad(d.getMilliseconds(), p, 3);
    }

    function formatMicroseconds(d, p) {
      return formatMilliseconds(d, p) + "000";
    }

    function formatMonthNumber(d, p) {
      return pad(d.getMonth() + 1, p, 2);
    }

    function formatMinutes(d, p) {
      return pad(d.getMinutes(), p, 2);
    }

    function formatSeconds(d, p) {
      return pad(d.getSeconds(), p, 2);
    }

    function formatWeekdayNumberMonday(d) {
      var day = d.getDay();
      return day === 0 ? 7 : day;
    }

    function formatWeekNumberSunday(d, p) {
      return pad(timeSunday.count(timeYear(d) - 1, d), p, 2);
    }

    function dISO(d) {
      var day = d.getDay();
      return (day >= 4 || day === 0) ? timeThursday(d) : timeThursday.ceil(d);
    }

    function formatWeekNumberISO(d, p) {
      d = dISO(d);
      return pad(timeThursday.count(timeYear(d), d) + (timeYear(d).getDay() === 4), p, 2);
    }

    function formatWeekdayNumberSunday(d) {
      return d.getDay();
    }

    function formatWeekNumberMonday(d, p) {
      return pad(timeMonday.count(timeYear(d) - 1, d), p, 2);
    }

    function formatYear(d, p) {
      return pad(d.getFullYear() % 100, p, 2);
    }

    function formatYearISO(d, p) {
      d = dISO(d);
      return pad(d.getFullYear() % 100, p, 2);
    }

    function formatFullYear(d, p) {
      return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatFullYearISO(d, p) {
      var day = d.getDay();
      d = (day >= 4 || day === 0) ? timeThursday(d) : timeThursday.ceil(d);
      return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatZone(d) {
      var z = d.getTimezoneOffset();
      return (z > 0 ? "-" : (z *= -1, "+"))
          + pad(z / 60 | 0, "0", 2)
          + pad(z % 60, "0", 2);
    }

    function formatUTCDayOfMonth(d, p) {
      return pad(d.getUTCDate(), p, 2);
    }

    function formatUTCHour24(d, p) {
      return pad(d.getUTCHours(), p, 2);
    }

    function formatUTCHour12(d, p) {
      return pad(d.getUTCHours() % 12 || 12, p, 2);
    }

    function formatUTCDayOfYear(d, p) {
      return pad(1 + utcDay.count(utcYear(d), d), p, 3);
    }

    function formatUTCMilliseconds(d, p) {
      return pad(d.getUTCMilliseconds(), p, 3);
    }

    function formatUTCMicroseconds(d, p) {
      return formatUTCMilliseconds(d, p) + "000";
    }

    function formatUTCMonthNumber(d, p) {
      return pad(d.getUTCMonth() + 1, p, 2);
    }

    function formatUTCMinutes(d, p) {
      return pad(d.getUTCMinutes(), p, 2);
    }

    function formatUTCSeconds(d, p) {
      return pad(d.getUTCSeconds(), p, 2);
    }

    function formatUTCWeekdayNumberMonday(d) {
      var dow = d.getUTCDay();
      return dow === 0 ? 7 : dow;
    }

    function formatUTCWeekNumberSunday(d, p) {
      return pad(utcSunday.count(utcYear(d) - 1, d), p, 2);
    }

    function UTCdISO(d) {
      var day = d.getUTCDay();
      return (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
    }

    function formatUTCWeekNumberISO(d, p) {
      d = UTCdISO(d);
      return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
    }

    function formatUTCWeekdayNumberSunday(d) {
      return d.getUTCDay();
    }

    function formatUTCWeekNumberMonday(d, p) {
      return pad(utcMonday.count(utcYear(d) - 1, d), p, 2);
    }

    function formatUTCYear(d, p) {
      return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCYearISO(d, p) {
      d = UTCdISO(d);
      return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCFullYear(d, p) {
      return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCFullYearISO(d, p) {
      var day = d.getUTCDay();
      d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
      return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCZone() {
      return "+0000";
    }

    function formatLiteralPercent() {
      return "%";
    }

    function formatUnixTimestamp(d) {
      return +d;
    }

    function formatUnixTimestampSeconds(d) {
      return Math.floor(+d / 1000);
    }

    var locale;
    var utcFormat;
    var utcParse;

    defaultLocale({
      dateTime: "%x, %X",
      date: "%-m/%-d/%Y",
      time: "%-I:%M:%S %p",
      periods: ["AM", "PM"],
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      locale.format;
      locale.parse;
      utcFormat = locale.utcFormat;
      utcParse = locale.utcParse;
      return locale;
    }

    var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

    function formatIsoNative(date) {
      return date.toISOString();
    }

    Date.prototype.toISOString
        ? formatIsoNative
        : utcFormat(isoSpecifier);

    function parseIsoNative(string) {
      var date = new Date(string);
      return isNaN(date) ? null : date;
    }

    +new Date("2000-01-01T00:00:00.000Z")
        ? parseIsoNative
        : utcParse(isoSpecifier);

    var defaultScales = {
    	x: linear,
    	y: linear,
    	z: linear,
    	r: sqrt
    };

    /* --------------------------------------------
     *
     * Determine whether a scale is a log, symlog, power or other
     * This is not meant to be exhaustive of all the different types of
     * scales in d3-scale and focuses on continuous scales
     *
     * --------------------------------------------
     */
    function findScaleType(scale) {
    	if (scale.constant) {
    		return 'symlog';
    	}
    	if (scale.base) {
    		return 'log';
    	}
    	if (scale.exponent) {
    		if (scale.exponent() === 0.5) {
    			return 'sqrt';
    		}
    		return 'pow';
    	}
    	return 'other';
    }

    /**
    	An identity function
    	@param {any} d The value to return.
    	@returns {any}
    */
    function identity (d) {
    	return d;
    }

    function log(sign) {
    	return x => Math.log(sign * x);
    }

    function exp(sign) {
    	return x => sign * Math.exp(x);
    }

    function symlog(c) {
    	return x => Math.sign(x) * Math.log1p(Math.abs(x / c));
    }

    function symexp(c) {
    	return x => Math.sign(x) * Math.expm1(Math.abs(x)) * c;
    }

    function pow(exponent) {
    	return function powFn(x) {
    		return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
    	};
    }

    function getPadFunctions(scale) {
    	const scaleType = findScaleType(scale);

    	if (scaleType === 'log') {
    		const sign = Math.sign(scale.domain()[0]);
    		return { lift: log(sign), ground: exp(sign), scaleType };
    	}
    	if (scaleType === 'pow') {
    		const exponent = 1;
    		return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
    	}
    	if (scaleType === 'sqrt') {
    		const exponent = 0.5;
    		return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
    	}
    	if (scaleType === 'symlog') {
    		const constant = 1;
    		return { lift: symlog(constant), ground: symexp(constant), scaleType };
    	}

    	return { lift: identity, ground: identity, scaleType };
    }

    function toTitleCase(str) {
    	return str.replace(/^\w/, d => d.toUpperCase())
    }

    function f(name, modifier = '') {
    	return `scale${toTitleCase(modifier)}${toTitleCase(name)}`;
    }

    /**
      Get a D3 scale name
    	https://svelte.dev/repl/ec6491055208401ca41120c9c8a67737?version=3.49.0
    	@param {Function} scale A D3 scale
    	@returns {String} The scale's name
     */
    function findScaleName(scale) {
    	/**
    	 * Ordinal scales
    	 */
    	// scaleBand, scalePoint
    	// @ts-ignore
    	if (typeof scale.bandwidth === 'function') {
    		// @ts-ignore
    		if (typeof scale.paddingInner === 'function') {
    			return f('band');
    		}
    		return f('point');
    	}
    	// scaleOrdinal
    	if (arraysEqual(Object.keys(scale), ['domain', 'range', 'unknown', 'copy'])) {
    		return f('ordinal');
    	}

    	/**
    	 * Sequential versus divergin
    	 */
    	let modifier = '';
    	// @ts-ignore
    	if (scale.interpolator) {
    		// @ts-ignore
    		if (scale.domain().length === 3) {
    			modifier = 'diverging';
    		} else {
    			modifier = 'sequential';
    		}
    	}

    	/**
    	 * Continuous scales
    	 */
    	// @ts-ignore
    	if (scale.quantiles) {
    		return f('quantile', modifier);
    	}
    	// @ts-ignore
    	if (scale.thresholds) {
    		return f('quantize', modifier);
    	}
    	// @ts-ignore
    	if (scale.constant) {
    		return f('symlog', modifier);
    	}
    	// @ts-ignore
    	if (scale.base) {
    		return f('log', modifier);
    	}
    	// @ts-ignore
    	if (scale.exponent) {
    		// @ts-ignore
    		if (scale.exponent() === 0.5) {
    			return f('sqrt', modifier);
    		}
    		return f('pow', modifier);
    	}

    	if (arraysEqual(Object.keys(scale), ['domain', 'range', 'invertExtent', 'unknown', 'copy'])) {
    		return f('threshold');
    	}

    	if (arraysEqual(Object.keys(scale), ['invert', 'range', 'domain', 'unknown', 'copy', 'ticks', 'tickFormat', 'nice'])) {
    		return f('identity');
    	}

    	if (
    		arraysEqual(Object.keys(scale), [
    			'invert', 'domain', 'range', 'rangeRound', 'round', 'clamp', 'unknown', 'copy', 'ticks', 'tickFormat', 'nice'
    		])
    	) {
    		return f('radial');
    	}

    	if (modifier) {
    		return f(modifier);
    	}

    	/**
    	 * Test for scaleTime vs scaleUtc
    	 * https://github.com/d3/d3-scale/pull/274#issuecomment-1462935595
    	 */
    	// @ts-ignore
    	if (scale.domain()[0] instanceof Date) {
    		const d = new Date;
    		let s;
    		// @ts-ignore
    		d.getDay = () => s = 'time';
    		// @ts-ignore
    		d.getUTCDay = () => s = 'utc';

    		// @ts-ignore
    		scale.tickFormat(0, '%a')(d);
    		return f(s);
    	}

    	return f('linear');
    }

    /**
    	Returns a modified scale domain by in/decreasing
    	the min/max by taking the desired difference
    	in pixels and converting it to units of data.
    	Returns an array that you can set as the new domain.
    	Padding contributed by @veltman.
    	See here for discussion of transforms: https://github.com/d3/d3-scale/issues/150
    	@param {Function} scale A D3 scale funcion
    	@param {Number[]} padding A two-value array of numbers specifying padding in pixels
    	@returns {Number[]} The padded domain
    */

    // These scales have a discrete range so they can't be padded
    const unpaddable = ['scaleThreshold', 'scaleQuantile', 'scaleQuantize', 'scaleSequentialQuantile'];

    function padScale (scale, padding) {
    	if (typeof scale.range !== 'function') {
    		console.log(scale);
    		throw new Error('Scale method `range` must be a function');
    	}
    	if (typeof scale.domain !== 'function') {
    		throw new Error('Scale method `domain` must be a function');
    	}

    	if (!Array.isArray(padding) || unpaddable.includes(findScaleName(scale))) {
    		return scale.domain();
    	}

    	if (isOrdinalDomain(scale) === true) {
    		return scale.domain();
    	}

    	const { lift, ground } = getPadFunctions(scale);

    	const d0 = scale.domain()[0];

    	const isTime = Object.prototype.toString.call(d0) === '[object Date]';

    	const [d1, d2] = scale.domain().map(d => {
    		return isTime ? lift(d.getTime()) : lift(d);
    	});
    	const [r1, r2] = scale.range();
    	const paddingLeft = padding[0] || 0;
    	const paddingRight = padding[1] || 0;

    	const step = (d2 - d1) / (Math.abs(r2 - r1) - paddingLeft - paddingRight); // Math.abs() to properly handle reversed scales

    	return [d1 - paddingLeft * step, paddingRight * step + d2].map(d => {
    		return isTime ? ground(new Date(d)) : ground(d);
    	});
    }

    /* eslint-disable no-nested-ternary */
    function calcBaseRange(s, width, height, reverse, percentRange) {
    	let min;
    	let max;
    	if (percentRange === true) {
    		min = 0;
    		max = 100;
    	} else {
    		min = s === 'r' ? 1 : 0;
    		max = s === 'y' ? height : s === 'r' ? 25 : width;
    	}
    	return reverse === true ? [max, min] : [min, max];
    }

    function getDefaultRange(s, width, height, reverse, range, percentRange) {
    	return !range
    		? calcBaseRange(s, width, height, reverse, percentRange)
    		: typeof range === 'function'
    			? range({ width, height })
    			: range;
    }

    function createScale (s) {
    	return function scaleCreator ([$scale, $extents, $domain, $padding, $nice, $reverse, $width, $height, $range, $percentScale]) {
    		if ($extents === null) {
    			return null;
    		}

    		const defaultRange = getDefaultRange(s, $width, $height, $reverse, $range, $percentScale);

    		const scale = $scale === defaultScales[s] ? $scale() : $scale.copy();

    		/* --------------------------------------------
    		 * Set the domain
    		 */
    		scale.domain($domain);

    		/* --------------------------------------------
    		 * Set the range of the scale to our default if
    		 * the scale doesn't have an interpolator function
    		 * or if it does, still set the range if that function
    		 * is the default identity function
    		 */
    		if (
    			!scale.interpolator ||
    			(
    				typeof scale.interpolator === 'function'
    				&& scale.interpolator().name.startsWith('identity')
    			)
    		) {
    			scale.range(defaultRange);
    		}

    		if ($padding) {
    			scale.domain(padScale(scale, $padding));
    		}

    		if ($nice === true || typeof $nice === 'number') {
    			if (typeof scale.nice === 'function') {
    				scale.nice(typeof $nice === 'number' ? $nice : undefined);
    			} else {
    				console.error(`[Layer Cake] You set \`${s}Nice: true\` but the ${s}Scale does not have a \`.nice\` method. Ignoring...`);
    			}
    		}

    		return scale;
    	};
    }

    function createGetter ([$acc, $scale]) {
    	return d => {
    		const val = $acc(d);
    		if (Array.isArray(val)) {
    			return val.map(v => $scale(v));
    		}
    		return $scale(val);
    	};
    }

    function getRange([$scale]) {
    	if (typeof $scale === 'function') {
    		if (typeof $scale.range === 'function') {
    			return $scale.range();
    		}
    		console.error('[LayerCake] Your scale doesn\'t have a `.range` method?');
    	}
    	return null;
    }

    const indent = '    ';

    function getRgb(clr){
    	const { r, g, b, opacity: o } = rgb$1(clr);
    	if (![r, g, b].every(c => c >= 0 && c <= 255)) {
    		return false;
    	}
    	return { r, g, b, o };
    }

    /**
     * Calculate human-perceived lightness from RGB
     * This doesn't take opacity into account
     * https://stackoverflow.com/a/596243
     */
    function contrast({ r, g, b }) {
    	const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    	return luminance > 0.6 ? 'black' : 'white';
    }

    /* --------------------------------------------
     *
     * Print out the values of an object
     * --------------------------------------------
     */
    function printDebug(obj) {
    	console.log('/********* LayerCake Debug ************/');
    	console.log('Bounding box:');
    	printObject(obj.boundingBox);
    	console.log('Scales:\n');
    	Object.keys(obj.activeGetters).forEach(g => {
    		printScale(g, obj[`${g}Scale`], obj[g]);
    	});
    	console.log('/************ End LayerCake Debug ***************/\n');
    }

    function printObject(obj) {
    	Object.entries(obj).forEach(([key, value]) => {
    		console.log(`${indent}${key}:`, value);
    	});
    }

    function printScale(s, scale, acc) {
    	const scaleName = findScaleName(scale);
    	console.log(`${indent}${s}:`);
    	console.log(`${indent}${indent}Accessor: "${acc.toString()}"`);
    	console.log(`${indent}${indent}Type: ${scaleName}`);
    	printValues(scale, 'domain');
    	printValues(scale, 'range', ' ');
    }

    function printValues(scale, method, extraSpace = '') {
    	const values = scale[method]();
    	const colorValues = colorizeArray(values);
    	if (colorValues) {
    		printColorArray(colorValues, method, values);
    	} else {
    		console.log(`${indent}${indent}${toTitleCase(method)}:${extraSpace}`, values);
    	}
    }

    function printColorArray(colorValues, method, values) {
    	console.log(
    		`${indent}${indent}${toTitleCase(method)}:    %cArray%c(${values.length}) ` + colorValues[0] + '%c ]',
    		'color: #1377e4',
    		'color: #737373',
    		'color: #1478e4',
    		...colorValues[1],
    		'color: #1478e4'
    	);
    }
    function colorizeArray(arr) {
    	const colors = [];
    	const a = arr.map((d, i) => {
    		const rgbo = getRgb(d);
    		if (rgbo !== false) {
    			colors.push(rgbo);
    			// Add a space to the last item
    			const space = i === arr.length - 1 ? ' ' : '';
    			return `%c ${d}${space}`;
    		}
    		return d;
    	});
    	if (colors.length) {
    		return [
    			`%c[ ${a.join(', ')}`,
    			colors.map(
    				d => `background-color: rgba(${d.r}, ${d.g}, ${d.b}, ${d.o}); color:${contrast(d)};`
    			)
    		];
    	}
    	return null;
    }

    /* node_modules/layercake/dist/LayerCake.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1, console: console_1$1 } = globals;
    const file$4 = "node_modules/layercake/dist/LayerCake.svelte";

    const get_default_slot_changes$1 = dirty => ({
    	element: dirty[0] & /*element*/ 4,
    	width: dirty[1] & /*$width_d*/ 8,
    	height: dirty[1] & /*$height_d*/ 16,
    	aspectRatio: dirty[1] & /*$aspectRatio_d*/ 32,
    	containerWidth: dirty[1] & /*$_containerWidth*/ 2,
    	containerHeight: dirty[1] & /*$_containerHeight*/ 1,
    	activeGetters: dirty[0] & /*$activeGetters_d*/ 1024,
    	percentRange: dirty[1] & /*$_percentRange*/ 4,
    	x: dirty[0] & /*$_x*/ 268435456,
    	y: dirty[0] & /*$_y*/ 134217728,
    	z: dirty[0] & /*$_z*/ 67108864,
    	r: dirty[0] & /*$_r*/ 33554432,
    	custom: dirty[0] & /*$_custom*/ 4096,
    	data: dirty[0] & /*$_data*/ 1073741824,
    	xNice: dirty[0] & /*$_xNice*/ 16777216,
    	yNice: dirty[0] & /*$_yNice*/ 8388608,
    	zNice: dirty[0] & /*$_zNice*/ 4194304,
    	rNice: dirty[0] & /*$_rNice*/ 2097152,
    	xReverse: dirty[0] & /*$_xReverse*/ 1048576,
    	yReverse: dirty[0] & /*$_yReverse*/ 524288,
    	zReverse: dirty[0] & /*$_zReverse*/ 262144,
    	rReverse: dirty[0] & /*$_rReverse*/ 131072,
    	xPadding: dirty[0] & /*$_xPadding*/ 65536,
    	yPadding: dirty[0] & /*$_yPadding*/ 32768,
    	zPadding: dirty[0] & /*$_zPadding*/ 16384,
    	rPadding: dirty[0] & /*$_rPadding*/ 8192,
    	padding: dirty[1] & /*$padding_d*/ 64,
    	flatData: dirty[0] & /*$_flatData*/ 536870912,
    	extents: dirty[1] & /*$extents_d*/ 128,
    	xDomain: dirty[1] & /*$xDomain_d*/ 256,
    	yDomain: dirty[1] & /*$yDomain_d*/ 512,
    	zDomain: dirty[1] & /*$zDomain_d*/ 1024,
    	rDomain: dirty[1] & /*$rDomain_d*/ 2048,
    	xRange: dirty[1] & /*$xRange_d*/ 4096,
    	yRange: dirty[1] & /*$yRange_d*/ 8192,
    	zRange: dirty[1] & /*$zRange_d*/ 16384,
    	rRange: dirty[1] & /*$rRange_d*/ 32768,
    	config: dirty[0] & /*$_config*/ 2048,
    	xScale: dirty[0] & /*$xScale_d*/ 512,
    	xGet: dirty[1] & /*$xGet_d*/ 65536,
    	yScale: dirty[0] & /*$yScale_d*/ 256,
    	yGet: dirty[1] & /*$yGet_d*/ 131072,
    	zScale: dirty[0] & /*$zScale_d*/ 128,
    	zGet: dirty[1] & /*$zGet_d*/ 262144,
    	rScale: dirty[0] & /*$rScale_d*/ 64,
    	rGet: dirty[1] & /*$rGet_d*/ 524288
    });

    const get_default_slot_context$1 = ctx => ({
    	element: /*element*/ ctx[2],
    	width: /*$width_d*/ ctx[34],
    	height: /*$height_d*/ ctx[35],
    	aspectRatio: /*$aspectRatio_d*/ ctx[36],
    	containerWidth: /*$_containerWidth*/ ctx[32],
    	containerHeight: /*$_containerHeight*/ ctx[31],
    	activeGetters: /*$activeGetters_d*/ ctx[10],
    	percentRange: /*$_percentRange*/ ctx[33],
    	x: /*$_x*/ ctx[28],
    	y: /*$_y*/ ctx[27],
    	z: /*$_z*/ ctx[26],
    	r: /*$_r*/ ctx[25],
    	custom: /*$_custom*/ ctx[12],
    	data: /*$_data*/ ctx[30],
    	xNice: /*$_xNice*/ ctx[24],
    	yNice: /*$_yNice*/ ctx[23],
    	zNice: /*$_zNice*/ ctx[22],
    	rNice: /*$_rNice*/ ctx[21],
    	xReverse: /*$_xReverse*/ ctx[20],
    	yReverse: /*$_yReverse*/ ctx[19],
    	zReverse: /*$_zReverse*/ ctx[18],
    	rReverse: /*$_rReverse*/ ctx[17],
    	xPadding: /*$_xPadding*/ ctx[16],
    	yPadding: /*$_yPadding*/ ctx[15],
    	zPadding: /*$_zPadding*/ ctx[14],
    	rPadding: /*$_rPadding*/ ctx[13],
    	padding: /*$padding_d*/ ctx[37],
    	flatData: /*$_flatData*/ ctx[29],
    	extents: /*$extents_d*/ ctx[38],
    	xDomain: /*$xDomain_d*/ ctx[39],
    	yDomain: /*$yDomain_d*/ ctx[40],
    	zDomain: /*$zDomain_d*/ ctx[41],
    	rDomain: /*$rDomain_d*/ ctx[42],
    	xRange: /*$xRange_d*/ ctx[43],
    	yRange: /*$yRange_d*/ ctx[44],
    	zRange: /*$zRange_d*/ ctx[45],
    	rRange: /*$rRange_d*/ ctx[46],
    	config: /*$_config*/ ctx[11],
    	xScale: /*$xScale_d*/ ctx[9],
    	xGet: /*$xGet_d*/ ctx[47],
    	yScale: /*$yScale_d*/ ctx[8],
    	yGet: /*$yGet_d*/ ctx[48],
    	zScale: /*$zScale_d*/ ctx[7],
    	zGet: /*$zGet_d*/ ctx[49],
    	rScale: /*$rScale_d*/ ctx[6],
    	rGet: /*$rGet_d*/ ctx[50]
    });

    // (473:0) {#if ssr === true || typeof window !== 'undefined'}
    function create_if_block$2(ctx) {
    	let div;
    	let div_resize_listener;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[153].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[152], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "layercake-container svelte-vhzpsp");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[155].call(div));
    			set_style(div, "position", /*position*/ ctx[5]);
    			set_style(div, "top", /*position*/ ctx[5] === 'absolute' ? '0' : null);
    			set_style(div, "right", /*position*/ ctx[5] === 'absolute' ? '0' : null);
    			set_style(div, "bottom", /*position*/ ctx[5] === 'absolute' ? '0' : null);
    			set_style(div, "left", /*position*/ ctx[5] === 'absolute' ? '0' : null);
    			set_style(div, "pointer-events", /*pointerEvents*/ ctx[4] === false ? 'none' : null);
    			add_location(div, file$4, 473, 1, 21905);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[154](div);
    			div_resize_listener = add_iframe_resize_listener(div, /*div_elementresize_handler*/ ctx[155].bind(div));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*element, $activeGetters_d, $_x, $_y, $_z, $_r, $_custom, $_data, $_xNice, $_yNice, $_zNice, $_rNice, $_xReverse, $_yReverse, $_zReverse, $_rReverse, $_xPadding, $_yPadding, $_zPadding, $_rPadding, $_flatData, $_config, $xScale_d, $yScale_d, $zScale_d, $rScale_d*/ 2147483588 | dirty[1] & /*$width_d, $height_d, $aspectRatio_d, $_containerWidth, $_containerHeight, $_percentRange, $padding_d, $extents_d, $xDomain_d, $yDomain_d, $zDomain_d, $rDomain_d, $xRange_d, $yRange_d, $zRange_d, $rRange_d, $xGet_d, $yGet_d, $zGet_d, $rGet_d*/ 1048575 | dirty[4] & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[152],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[152])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[152], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "position", /*position*/ ctx[5]);
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "top", /*position*/ ctx[5] === 'absolute' ? '0' : null);
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "right", /*position*/ ctx[5] === 'absolute' ? '0' : null);
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "bottom", /*position*/ ctx[5] === 'absolute' ? '0' : null);
    			}

    			if (dirty[0] & /*position*/ 32) {
    				set_style(div, "left", /*position*/ ctx[5] === 'absolute' ? '0' : null);
    			}

    			if (dirty[0] & /*pointerEvents*/ 16) {
    				set_style(div, "pointer-events", /*pointerEvents*/ ctx[4] === false ? 'none' : null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[154](null);
    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(473:0) {#if ssr === true || typeof window !== 'undefined'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*ssr*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let yReverseValue;
    	let context;
    	let $rScale_d;
    	let $zScale_d;
    	let $yScale_d;
    	let $xScale_d;
    	let $activeGetters_d;
    	let $box_d;
    	let $_config;
    	let $_custom;
    	let $_rScale;
    	let $_zScale;
    	let $_yScale;
    	let $_xScale;
    	let $_rRange;
    	let $_zRange;
    	let $_yRange;
    	let $_xRange;
    	let $_rPadding;
    	let $_zPadding;
    	let $_yPadding;
    	let $_xPadding;
    	let $_rReverse;
    	let $_zReverse;
    	let $_yReverse;
    	let $_xReverse;
    	let $_rNice;
    	let $_zNice;
    	let $_yNice;
    	let $_xNice;
    	let $_rDomain;
    	let $_zDomain;
    	let $_yDomain;
    	let $_xDomain;
    	let $_r;
    	let $_z;
    	let $_y;
    	let $_x;
    	let $_padding;
    	let $_flatData;
    	let $_data;
    	let $_extents;
    	let $_containerHeight;
    	let $_containerWidth;
    	let $_percentRange;
    	let $width_d;
    	let $height_d;
    	let $aspectRatio_d;
    	let $padding_d;
    	let $extents_d;
    	let $xDomain_d;
    	let $yDomain_d;
    	let $zDomain_d;
    	let $rDomain_d;
    	let $xRange_d;
    	let $yRange_d;
    	let $zRange_d;
    	let $rRange_d;
    	let $xGet_d;
    	let $yGet_d;
    	let $zGet_d;
    	let $rGet_d;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayerCake', slots, ['default']);
    	const printDebug_debounced = debounce(printDebug, 200);
    	let { ssr = false } = $$props;
    	let { pointerEvents = true } = $$props;
    	let { position = 'relative' } = $$props;
    	let { percentRange = false } = $$props;
    	let { width = undefined } = $$props;
    	let { height = undefined } = $$props;
    	let { containerWidth = width || 100 } = $$props;
    	let { containerHeight = height || 100 } = $$props;
    	let { element = undefined } = $$props;
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { z = undefined } = $$props;
    	let { r = undefined } = $$props;
    	let { data = [] } = $$props;
    	let { xDomain = undefined } = $$props;
    	let { yDomain = undefined } = $$props;
    	let { zDomain = undefined } = $$props;
    	let { rDomain = undefined } = $$props;
    	let { xNice = false } = $$props;
    	let { yNice = false } = $$props;
    	let { zNice = false } = $$props;
    	let { rNice = false } = $$props;
    	let { xPadding = undefined } = $$props;
    	let { yPadding = undefined } = $$props;
    	let { zPadding = undefined } = $$props;
    	let { rPadding = undefined } = $$props;
    	let { xScale = defaultScales.x } = $$props;
    	let { yScale = defaultScales.y } = $$props;
    	let { zScale = defaultScales.z } = $$props;
    	let { rScale = defaultScales.r } = $$props;
    	let { xRange = undefined } = $$props;
    	let { yRange = undefined } = $$props;
    	let { zRange = undefined } = $$props;
    	let { rRange = undefined } = $$props;
    	let { xReverse = false } = $$props;
    	let { yReverse = undefined } = $$props;
    	let { zReverse = false } = $$props;
    	let { rReverse = false } = $$props;
    	let { padding = {} } = $$props;
    	let { extents = {} } = $$props;
    	let { flatData = undefined } = $$props;
    	let { custom = {} } = $$props;
    	let { debug = false } = $$props;

    	/* --------------------------------------------
     * Keep track of whether the component has mounted
     * This is used to emit warnings once we have measured
     * the container object and it doesn't have proper dimensions
     */
    	let isMounted = false;

    	onMount(() => {
    		isMounted = true;
    	});

    	/* --------------------------------------------
     * Preserve a copy of our passed in settings before we modify them
     * Return this to the user's context so they can reference things if need be
     * Add the active keys since those aren't on our settings object.
     * This is mostly an escape-hatch
     */
    	const config = {};

    	/* --------------------------------------------
     * Make store versions of each parameter
     * Prefix these with `_` to keep things organized
     */
    	const _percentRange = writable(percentRange);

    	validate_store(_percentRange, '_percentRange');
    	component_subscribe($$self, _percentRange, value => $$invalidate(33, $_percentRange = value));
    	const _containerWidth = writable(containerWidth);
    	validate_store(_containerWidth, '_containerWidth');
    	component_subscribe($$self, _containerWidth, value => $$invalidate(32, $_containerWidth = value));
    	const _containerHeight = writable(containerHeight);
    	validate_store(_containerHeight, '_containerHeight');
    	component_subscribe($$self, _containerHeight, value => $$invalidate(31, $_containerHeight = value));
    	const _extents = writable(filterObject(extents));
    	validate_store(_extents, '_extents');
    	component_subscribe($$self, _extents, value => $$invalidate(170, $_extents = value));
    	const _data = writable(data);
    	validate_store(_data, '_data');
    	component_subscribe($$self, _data, value => $$invalidate(30, $_data = value));
    	const _flatData = writable(flatData || data);
    	validate_store(_flatData, '_flatData');
    	component_subscribe($$self, _flatData, value => $$invalidate(29, $_flatData = value));
    	const _padding = writable(padding);
    	validate_store(_padding, '_padding');
    	component_subscribe($$self, _padding, value => $$invalidate(169, $_padding = value));
    	const _x = writable(makeAccessor(x));
    	validate_store(_x, '_x');
    	component_subscribe($$self, _x, value => $$invalidate(28, $_x = value));
    	const _y = writable(makeAccessor(y));
    	validate_store(_y, '_y');
    	component_subscribe($$self, _y, value => $$invalidate(27, $_y = value));
    	const _z = writable(makeAccessor(z));
    	validate_store(_z, '_z');
    	component_subscribe($$self, _z, value => $$invalidate(26, $_z = value));
    	const _r = writable(makeAccessor(r));
    	validate_store(_r, '_r');
    	component_subscribe($$self, _r, value => $$invalidate(25, $_r = value));
    	const _xDomain = writable(xDomain);
    	validate_store(_xDomain, '_xDomain');
    	component_subscribe($$self, _xDomain, value => $$invalidate(168, $_xDomain = value));
    	const _yDomain = writable(yDomain);
    	validate_store(_yDomain, '_yDomain');
    	component_subscribe($$self, _yDomain, value => $$invalidate(167, $_yDomain = value));
    	const _zDomain = writable(zDomain);
    	validate_store(_zDomain, '_zDomain');
    	component_subscribe($$self, _zDomain, value => $$invalidate(166, $_zDomain = value));
    	const _rDomain = writable(rDomain);
    	validate_store(_rDomain, '_rDomain');
    	component_subscribe($$self, _rDomain, value => $$invalidate(165, $_rDomain = value));
    	const _xNice = writable(xNice);
    	validate_store(_xNice, '_xNice');
    	component_subscribe($$self, _xNice, value => $$invalidate(24, $_xNice = value));
    	const _yNice = writable(yNice);
    	validate_store(_yNice, '_yNice');
    	component_subscribe($$self, _yNice, value => $$invalidate(23, $_yNice = value));
    	const _zNice = writable(zNice);
    	validate_store(_zNice, '_zNice');
    	component_subscribe($$self, _zNice, value => $$invalidate(22, $_zNice = value));
    	const _rNice = writable(rNice);
    	validate_store(_rNice, '_rNice');
    	component_subscribe($$self, _rNice, value => $$invalidate(21, $_rNice = value));
    	const _xReverse = writable(xReverse);
    	validate_store(_xReverse, '_xReverse');
    	component_subscribe($$self, _xReverse, value => $$invalidate(20, $_xReverse = value));
    	const _yReverse = writable(yReverseValue);
    	validate_store(_yReverse, '_yReverse');
    	component_subscribe($$self, _yReverse, value => $$invalidate(19, $_yReverse = value));
    	const _zReverse = writable(zReverse);
    	validate_store(_zReverse, '_zReverse');
    	component_subscribe($$self, _zReverse, value => $$invalidate(18, $_zReverse = value));
    	const _rReverse = writable(rReverse);
    	validate_store(_rReverse, '_rReverse');
    	component_subscribe($$self, _rReverse, value => $$invalidate(17, $_rReverse = value));
    	const _xPadding = writable(xPadding);
    	validate_store(_xPadding, '_xPadding');
    	component_subscribe($$self, _xPadding, value => $$invalidate(16, $_xPadding = value));
    	const _yPadding = writable(yPadding);
    	validate_store(_yPadding, '_yPadding');
    	component_subscribe($$self, _yPadding, value => $$invalidate(15, $_yPadding = value));
    	const _zPadding = writable(zPadding);
    	validate_store(_zPadding, '_zPadding');
    	component_subscribe($$self, _zPadding, value => $$invalidate(14, $_zPadding = value));
    	const _rPadding = writable(rPadding);
    	validate_store(_rPadding, '_rPadding');
    	component_subscribe($$self, _rPadding, value => $$invalidate(13, $_rPadding = value));
    	const _xRange = writable(xRange);
    	validate_store(_xRange, '_xRange');
    	component_subscribe($$self, _xRange, value => $$invalidate(164, $_xRange = value));
    	const _yRange = writable(yRange);
    	validate_store(_yRange, '_yRange');
    	component_subscribe($$self, _yRange, value => $$invalidate(163, $_yRange = value));
    	const _zRange = writable(zRange);
    	validate_store(_zRange, '_zRange');
    	component_subscribe($$self, _zRange, value => $$invalidate(162, $_zRange = value));
    	const _rRange = writable(rRange);
    	validate_store(_rRange, '_rRange');
    	component_subscribe($$self, _rRange, value => $$invalidate(161, $_rRange = value));
    	const _xScale = writable(xScale);
    	validate_store(_xScale, '_xScale');
    	component_subscribe($$self, _xScale, value => $$invalidate(160, $_xScale = value));
    	const _yScale = writable(yScale);
    	validate_store(_yScale, '_yScale');
    	component_subscribe($$self, _yScale, value => $$invalidate(159, $_yScale = value));
    	const _zScale = writable(zScale);
    	validate_store(_zScale, '_zScale');
    	component_subscribe($$self, _zScale, value => $$invalidate(158, $_zScale = value));
    	const _rScale = writable(rScale);
    	validate_store(_rScale, '_rScale');
    	component_subscribe($$self, _rScale, value => $$invalidate(157, $_rScale = value));
    	const _config = writable(config);
    	validate_store(_config, '_config');
    	component_subscribe($$self, _config, value => $$invalidate(11, $_config = value));
    	const _custom = writable(custom);
    	validate_store(_custom, '_custom');
    	component_subscribe($$self, _custom, value => $$invalidate(12, $_custom = value));

    	/* --------------------------------------------
     * Create derived values
     * Suffix these with `_d`
     */
    	const activeGetters_d = derived([_x, _y, _z, _r], ([$x, $y, $z, $r]) => {
    		const obj = {};

    		if ($x) {
    			obj.x = $x;
    		}

    		if ($y) {
    			obj.y = $y;
    		}

    		if ($z) {
    			obj.z = $z;
    		}

    		if ($r) {
    			obj.r = $r;
    		}

    		return obj;
    	});

    	validate_store(activeGetters_d, 'activeGetters_d');
    	component_subscribe($$self, activeGetters_d, value => $$invalidate(10, $activeGetters_d = value));

    	const padding_d = derived([_padding, _containerWidth, _containerHeight], ([$padding]) => {
    		const defaultPadding = { top: 0, right: 0, bottom: 0, left: 0 };
    		return Object.assign(defaultPadding, $padding);
    	});

    	validate_store(padding_d, 'padding_d');
    	component_subscribe($$self, padding_d, value => $$invalidate(37, $padding_d = value));

    	const box_d = derived([_containerWidth, _containerHeight, padding_d], ([$containerWidth, $containerHeight, $padding]) => {
    		const b = {};
    		b.top = $padding.top;
    		b.right = $containerWidth - $padding.right;
    		b.bottom = $containerHeight - $padding.bottom;
    		b.left = $padding.left;
    		b.width = b.right - b.left;
    		b.height = b.bottom - b.top;

    		if (b.width <= 0 && isMounted === true) {
    			console.warn('[LayerCake] Target div has zero or negative width. Did you forget to set an explicit width in CSS on the container?');
    		}

    		if (b.height <= 0 && isMounted === true) {
    			console.warn('[LayerCake] Target div has zero or negative height. Did you forget to set an explicit height in CSS on the container?');
    		}

    		return b;
    	});

    	validate_store(box_d, 'box_d');
    	component_subscribe($$self, box_d, value => $$invalidate(151, $box_d = value));

    	const width_d = derived([box_d], ([$box]) => {
    		return $box.width;
    	});

    	validate_store(width_d, 'width_d');
    	component_subscribe($$self, width_d, value => $$invalidate(34, $width_d = value));

    	const height_d = derived([box_d], ([$box]) => {
    		return $box.height;
    	});

    	validate_store(height_d, 'height_d');
    	component_subscribe($$self, height_d, value => $$invalidate(35, $height_d = value));

    	/* --------------------------------------------
     * Calculate extents by taking the extent of the data
     * and filling that in with anything set by the user
     * Note that this is different from an "extent" passed
     * in as a domain, which can be a partial domain
     */
    	const extents_d = derived([_flatData, activeGetters_d, _extents, _xScale, _yScale, _rScale, _zScale], ([$flatData, $activeGetters, $extents, $_xScale, $_yScale, $_rScale, $_zScale]) => {
    		const scaleLookup = {
    			x: $_xScale,
    			y: $_yScale,
    			r: $_rScale,
    			z: $_zScale
    		};

    		const getters = filterObject($activeGetters, $extents);
    		const activeScales = Object.fromEntries(Object.keys(getters).map(k => [k, scaleLookup[k]]));

    		if (Object.keys(getters).length > 0) {
    			const calculatedExtents = calcScaleExtents($flatData, getters, activeScales);
    			return { ...calculatedExtents, ...$extents };
    		} else {
    			return {};
    		}
    	});

    	validate_store(extents_d, 'extents_d');
    	component_subscribe($$self, extents_d, value => $$invalidate(38, $extents_d = value));
    	const xDomain_d = derived([extents_d, _xDomain], calcDomain('x'));
    	validate_store(xDomain_d, 'xDomain_d');
    	component_subscribe($$self, xDomain_d, value => $$invalidate(39, $xDomain_d = value));
    	const yDomain_d = derived([extents_d, _yDomain], calcDomain('y'));
    	validate_store(yDomain_d, 'yDomain_d');
    	component_subscribe($$self, yDomain_d, value => $$invalidate(40, $yDomain_d = value));
    	const zDomain_d = derived([extents_d, _zDomain], calcDomain('z'));
    	validate_store(zDomain_d, 'zDomain_d');
    	component_subscribe($$self, zDomain_d, value => $$invalidate(41, $zDomain_d = value));
    	const rDomain_d = derived([extents_d, _rDomain], calcDomain('r'));
    	validate_store(rDomain_d, 'rDomain_d');
    	component_subscribe($$self, rDomain_d, value => $$invalidate(42, $rDomain_d = value));

    	const xScale_d = derived(
    		[
    			_xScale,
    			extents_d,
    			xDomain_d,
    			_xPadding,
    			_xNice,
    			_xReverse,
    			width_d,
    			height_d,
    			_xRange,
    			_percentRange
    		],
    		createScale('x')
    	);

    	validate_store(xScale_d, 'xScale_d');
    	component_subscribe($$self, xScale_d, value => $$invalidate(9, $xScale_d = value));
    	const xGet_d = derived([_x, xScale_d], createGetter);
    	validate_store(xGet_d, 'xGet_d');
    	component_subscribe($$self, xGet_d, value => $$invalidate(47, $xGet_d = value));

    	const yScale_d = derived(
    		[
    			_yScale,
    			extents_d,
    			yDomain_d,
    			_yPadding,
    			_yNice,
    			_yReverse,
    			width_d,
    			height_d,
    			_yRange,
    			_percentRange
    		],
    		createScale('y')
    	);

    	validate_store(yScale_d, 'yScale_d');
    	component_subscribe($$self, yScale_d, value => $$invalidate(8, $yScale_d = value));
    	const yGet_d = derived([_y, yScale_d], createGetter);
    	validate_store(yGet_d, 'yGet_d');
    	component_subscribe($$self, yGet_d, value => $$invalidate(48, $yGet_d = value));

    	const zScale_d = derived(
    		[
    			_zScale,
    			extents_d,
    			zDomain_d,
    			_zPadding,
    			_zNice,
    			_zReverse,
    			width_d,
    			height_d,
    			_zRange,
    			_percentRange
    		],
    		createScale('z')
    	);

    	validate_store(zScale_d, 'zScale_d');
    	component_subscribe($$self, zScale_d, value => $$invalidate(7, $zScale_d = value));
    	const zGet_d = derived([_z, zScale_d], createGetter);
    	validate_store(zGet_d, 'zGet_d');
    	component_subscribe($$self, zGet_d, value => $$invalidate(49, $zGet_d = value));

    	const rScale_d = derived(
    		[
    			_rScale,
    			extents_d,
    			rDomain_d,
    			_rPadding,
    			_rNice,
    			_rReverse,
    			width_d,
    			height_d,
    			_rRange,
    			_percentRange
    		],
    		createScale('r')
    	);

    	validate_store(rScale_d, 'rScale_d');
    	component_subscribe($$self, rScale_d, value => $$invalidate(6, $rScale_d = value));
    	const rGet_d = derived([_r, rScale_d], createGetter);
    	validate_store(rGet_d, 'rGet_d');
    	component_subscribe($$self, rGet_d, value => $$invalidate(50, $rGet_d = value));
    	const xRange_d = derived([xScale_d], getRange);
    	validate_store(xRange_d, 'xRange_d');
    	component_subscribe($$self, xRange_d, value => $$invalidate(43, $xRange_d = value));
    	const yRange_d = derived([yScale_d], getRange);
    	validate_store(yRange_d, 'yRange_d');
    	component_subscribe($$self, yRange_d, value => $$invalidate(44, $yRange_d = value));
    	const zRange_d = derived([zScale_d], getRange);
    	validate_store(zRange_d, 'zRange_d');
    	component_subscribe($$self, zRange_d, value => $$invalidate(45, $zRange_d = value));
    	const rRange_d = derived([rScale_d], getRange);
    	validate_store(rRange_d, 'rRange_d');
    	component_subscribe($$self, rRange_d, value => $$invalidate(46, $rRange_d = value));

    	const aspectRatio_d = derived([width_d, height_d], ([$width, $height]) => {
    		return $width / $height;
    	});

    	validate_store(aspectRatio_d, 'aspectRatio_d');
    	component_subscribe($$self, aspectRatio_d, value => $$invalidate(36, $aspectRatio_d = value));

    	const writable_props = [
    		'ssr',
    		'pointerEvents',
    		'position',
    		'percentRange',
    		'width',
    		'height',
    		'containerWidth',
    		'containerHeight',
    		'element',
    		'x',
    		'y',
    		'z',
    		'r',
    		'data',
    		'xDomain',
    		'yDomain',
    		'zDomain',
    		'rDomain',
    		'xNice',
    		'yNice',
    		'zNice',
    		'rNice',
    		'xPadding',
    		'yPadding',
    		'zPadding',
    		'rPadding',
    		'xScale',
    		'yScale',
    		'zScale',
    		'rScale',
    		'xRange',
    		'yRange',
    		'zRange',
    		'rRange',
    		'xReverse',
    		'yReverse',
    		'zReverse',
    		'rReverse',
    		'padding',
    		'extents',
    		'flatData',
    		'custom',
    		'debug'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<LayerCake> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	function div_elementresize_handler() {
    		containerWidth = this.clientWidth;
    		containerHeight = this.clientHeight;
    		$$invalidate(0, containerWidth);
    		$$invalidate(1, containerHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('ssr' in $$props) $$invalidate(3, ssr = $$props.ssr);
    		if ('pointerEvents' in $$props) $$invalidate(4, pointerEvents = $$props.pointerEvents);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('percentRange' in $$props) $$invalidate(111, percentRange = $$props.percentRange);
    		if ('width' in $$props) $$invalidate(112, width = $$props.width);
    		if ('height' in $$props) $$invalidate(113, height = $$props.height);
    		if ('containerWidth' in $$props) $$invalidate(0, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(1, containerHeight = $$props.containerHeight);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('x' in $$props) $$invalidate(114, x = $$props.x);
    		if ('y' in $$props) $$invalidate(115, y = $$props.y);
    		if ('z' in $$props) $$invalidate(116, z = $$props.z);
    		if ('r' in $$props) $$invalidate(117, r = $$props.r);
    		if ('data' in $$props) $$invalidate(118, data = $$props.data);
    		if ('xDomain' in $$props) $$invalidate(119, xDomain = $$props.xDomain);
    		if ('yDomain' in $$props) $$invalidate(120, yDomain = $$props.yDomain);
    		if ('zDomain' in $$props) $$invalidate(121, zDomain = $$props.zDomain);
    		if ('rDomain' in $$props) $$invalidate(122, rDomain = $$props.rDomain);
    		if ('xNice' in $$props) $$invalidate(123, xNice = $$props.xNice);
    		if ('yNice' in $$props) $$invalidate(124, yNice = $$props.yNice);
    		if ('zNice' in $$props) $$invalidate(125, zNice = $$props.zNice);
    		if ('rNice' in $$props) $$invalidate(126, rNice = $$props.rNice);
    		if ('xPadding' in $$props) $$invalidate(127, xPadding = $$props.xPadding);
    		if ('yPadding' in $$props) $$invalidate(128, yPadding = $$props.yPadding);
    		if ('zPadding' in $$props) $$invalidate(129, zPadding = $$props.zPadding);
    		if ('rPadding' in $$props) $$invalidate(130, rPadding = $$props.rPadding);
    		if ('xScale' in $$props) $$invalidate(131, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(132, yScale = $$props.yScale);
    		if ('zScale' in $$props) $$invalidate(133, zScale = $$props.zScale);
    		if ('rScale' in $$props) $$invalidate(134, rScale = $$props.rScale);
    		if ('xRange' in $$props) $$invalidate(135, xRange = $$props.xRange);
    		if ('yRange' in $$props) $$invalidate(136, yRange = $$props.yRange);
    		if ('zRange' in $$props) $$invalidate(137, zRange = $$props.zRange);
    		if ('rRange' in $$props) $$invalidate(138, rRange = $$props.rRange);
    		if ('xReverse' in $$props) $$invalidate(139, xReverse = $$props.xReverse);
    		if ('yReverse' in $$props) $$invalidate(140, yReverse = $$props.yReverse);
    		if ('zReverse' in $$props) $$invalidate(141, zReverse = $$props.zReverse);
    		if ('rReverse' in $$props) $$invalidate(142, rReverse = $$props.rReverse);
    		if ('padding' in $$props) $$invalidate(143, padding = $$props.padding);
    		if ('extents' in $$props) $$invalidate(144, extents = $$props.extents);
    		if ('flatData' in $$props) $$invalidate(145, flatData = $$props.flatData);
    		if ('custom' in $$props) $$invalidate(146, custom = $$props.custom);
    		if ('debug' in $$props) $$invalidate(147, debug = $$props.debug);
    		if ('$$scope' in $$props) $$invalidate(152, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		onMount,
    		writable,
    		derived,
    		makeAccessor,
    		filterObject,
    		debounce,
    		calcScaleExtents,
    		calcDomain,
    		createScale,
    		createGetter,
    		getRange,
    		printDebug,
    		defaultScales,
    		printDebug_debounced,
    		ssr,
    		pointerEvents,
    		position,
    		percentRange,
    		width,
    		height,
    		containerWidth,
    		containerHeight,
    		element,
    		x,
    		y,
    		z,
    		r,
    		data,
    		xDomain,
    		yDomain,
    		zDomain,
    		rDomain,
    		xNice,
    		yNice,
    		zNice,
    		rNice,
    		xPadding,
    		yPadding,
    		zPadding,
    		rPadding,
    		xScale,
    		yScale,
    		zScale,
    		rScale,
    		xRange,
    		yRange,
    		zRange,
    		rRange,
    		xReverse,
    		yReverse,
    		zReverse,
    		rReverse,
    		padding,
    		extents,
    		flatData,
    		custom,
    		debug,
    		isMounted,
    		config,
    		_percentRange,
    		_containerWidth,
    		_containerHeight,
    		_extents,
    		_data,
    		_flatData,
    		_padding,
    		_x,
    		_y,
    		_z,
    		_r,
    		_xDomain,
    		_yDomain,
    		_zDomain,
    		_rDomain,
    		_xNice,
    		_yNice,
    		_zNice,
    		_rNice,
    		_xReverse,
    		_yReverse,
    		_zReverse,
    		_rReverse,
    		_xPadding,
    		_yPadding,
    		_zPadding,
    		_rPadding,
    		_xRange,
    		_yRange,
    		_zRange,
    		_rRange,
    		_xScale,
    		_yScale,
    		_zScale,
    		_rScale,
    		_config,
    		_custom,
    		activeGetters_d,
    		padding_d,
    		box_d,
    		width_d,
    		height_d,
    		extents_d,
    		xDomain_d,
    		yDomain_d,
    		zDomain_d,
    		rDomain_d,
    		xScale_d,
    		xGet_d,
    		yScale_d,
    		yGet_d,
    		zScale_d,
    		zGet_d,
    		rScale_d,
    		rGet_d,
    		xRange_d,
    		yRange_d,
    		zRange_d,
    		rRange_d,
    		aspectRatio_d,
    		context,
    		yReverseValue,
    		$rScale_d,
    		$zScale_d,
    		$yScale_d,
    		$xScale_d,
    		$activeGetters_d,
    		$box_d,
    		$_config,
    		$_custom,
    		$_rScale,
    		$_zScale,
    		$_yScale,
    		$_xScale,
    		$_rRange,
    		$_zRange,
    		$_yRange,
    		$_xRange,
    		$_rPadding,
    		$_zPadding,
    		$_yPadding,
    		$_xPadding,
    		$_rReverse,
    		$_zReverse,
    		$_yReverse,
    		$_xReverse,
    		$_rNice,
    		$_zNice,
    		$_yNice,
    		$_xNice,
    		$_rDomain,
    		$_zDomain,
    		$_yDomain,
    		$_xDomain,
    		$_r,
    		$_z,
    		$_y,
    		$_x,
    		$_padding,
    		$_flatData,
    		$_data,
    		$_extents,
    		$_containerHeight,
    		$_containerWidth,
    		$_percentRange,
    		$width_d,
    		$height_d,
    		$aspectRatio_d,
    		$padding_d,
    		$extents_d,
    		$xDomain_d,
    		$yDomain_d,
    		$zDomain_d,
    		$rDomain_d,
    		$xRange_d,
    		$yRange_d,
    		$zRange_d,
    		$rRange_d,
    		$xGet_d,
    		$yGet_d,
    		$zGet_d,
    		$rGet_d
    	});

    	$$self.$inject_state = $$props => {
    		if ('ssr' in $$props) $$invalidate(3, ssr = $$props.ssr);
    		if ('pointerEvents' in $$props) $$invalidate(4, pointerEvents = $$props.pointerEvents);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('percentRange' in $$props) $$invalidate(111, percentRange = $$props.percentRange);
    		if ('width' in $$props) $$invalidate(112, width = $$props.width);
    		if ('height' in $$props) $$invalidate(113, height = $$props.height);
    		if ('containerWidth' in $$props) $$invalidate(0, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(1, containerHeight = $$props.containerHeight);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('x' in $$props) $$invalidate(114, x = $$props.x);
    		if ('y' in $$props) $$invalidate(115, y = $$props.y);
    		if ('z' in $$props) $$invalidate(116, z = $$props.z);
    		if ('r' in $$props) $$invalidate(117, r = $$props.r);
    		if ('data' in $$props) $$invalidate(118, data = $$props.data);
    		if ('xDomain' in $$props) $$invalidate(119, xDomain = $$props.xDomain);
    		if ('yDomain' in $$props) $$invalidate(120, yDomain = $$props.yDomain);
    		if ('zDomain' in $$props) $$invalidate(121, zDomain = $$props.zDomain);
    		if ('rDomain' in $$props) $$invalidate(122, rDomain = $$props.rDomain);
    		if ('xNice' in $$props) $$invalidate(123, xNice = $$props.xNice);
    		if ('yNice' in $$props) $$invalidate(124, yNice = $$props.yNice);
    		if ('zNice' in $$props) $$invalidate(125, zNice = $$props.zNice);
    		if ('rNice' in $$props) $$invalidate(126, rNice = $$props.rNice);
    		if ('xPadding' in $$props) $$invalidate(127, xPadding = $$props.xPadding);
    		if ('yPadding' in $$props) $$invalidate(128, yPadding = $$props.yPadding);
    		if ('zPadding' in $$props) $$invalidate(129, zPadding = $$props.zPadding);
    		if ('rPadding' in $$props) $$invalidate(130, rPadding = $$props.rPadding);
    		if ('xScale' in $$props) $$invalidate(131, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(132, yScale = $$props.yScale);
    		if ('zScale' in $$props) $$invalidate(133, zScale = $$props.zScale);
    		if ('rScale' in $$props) $$invalidate(134, rScale = $$props.rScale);
    		if ('xRange' in $$props) $$invalidate(135, xRange = $$props.xRange);
    		if ('yRange' in $$props) $$invalidate(136, yRange = $$props.yRange);
    		if ('zRange' in $$props) $$invalidate(137, zRange = $$props.zRange);
    		if ('rRange' in $$props) $$invalidate(138, rRange = $$props.rRange);
    		if ('xReverse' in $$props) $$invalidate(139, xReverse = $$props.xReverse);
    		if ('yReverse' in $$props) $$invalidate(140, yReverse = $$props.yReverse);
    		if ('zReverse' in $$props) $$invalidate(141, zReverse = $$props.zReverse);
    		if ('rReverse' in $$props) $$invalidate(142, rReverse = $$props.rReverse);
    		if ('padding' in $$props) $$invalidate(143, padding = $$props.padding);
    		if ('extents' in $$props) $$invalidate(144, extents = $$props.extents);
    		if ('flatData' in $$props) $$invalidate(145, flatData = $$props.flatData);
    		if ('custom' in $$props) $$invalidate(146, custom = $$props.custom);
    		if ('debug' in $$props) $$invalidate(147, debug = $$props.debug);
    		if ('isMounted' in $$props) isMounted = $$props.isMounted;
    		if ('context' in $$props) $$invalidate(149, context = $$props.context);
    		if ('yReverseValue' in $$props) $$invalidate(150, yReverseValue = $$props.yReverseValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[4] & /*yReverse, yScale*/ 65792) {
    			/**
     * Make this reactive
     */
    			$$invalidate(150, yReverseValue = typeof yReverse === 'undefined'
    			? typeof yScale.bandwidth === 'function' ? false : true
    			: yReverse);
    		}

    		if ($$self.$$.dirty[3] & /*x*/ 2097152) {
    			if (x) $$invalidate(148, config.x = x, config);
    		}

    		if ($$self.$$.dirty[3] & /*y*/ 4194304) {
    			if (y) $$invalidate(148, config.y = y, config);
    		}

    		if ($$self.$$.dirty[3] & /*z*/ 8388608) {
    			if (z) $$invalidate(148, config.z = z, config);
    		}

    		if ($$self.$$.dirty[3] & /*r*/ 16777216) {
    			if (r) $$invalidate(148, config.r = r, config);
    		}

    		if ($$self.$$.dirty[3] & /*xDomain*/ 67108864) {
    			if (xDomain) $$invalidate(148, config.xDomain = xDomain, config);
    		}

    		if ($$self.$$.dirty[3] & /*yDomain*/ 134217728) {
    			if (yDomain) $$invalidate(148, config.yDomain = yDomain, config);
    		}

    		if ($$self.$$.dirty[3] & /*zDomain*/ 268435456) {
    			if (zDomain) $$invalidate(148, config.zDomain = zDomain, config);
    		}

    		if ($$self.$$.dirty[3] & /*rDomain*/ 536870912) {
    			if (rDomain) $$invalidate(148, config.rDomain = rDomain, config);
    		}

    		if ($$self.$$.dirty[4] & /*xRange*/ 2048) {
    			if (xRange) $$invalidate(148, config.xRange = xRange, config);
    		}

    		if ($$self.$$.dirty[4] & /*yRange*/ 4096) {
    			if (yRange) $$invalidate(148, config.yRange = yRange, config);
    		}

    		if ($$self.$$.dirty[4] & /*zRange*/ 8192) {
    			if (zRange) $$invalidate(148, config.zRange = zRange, config);
    		}

    		if ($$self.$$.dirty[4] & /*rRange*/ 16384) {
    			if (rRange) $$invalidate(148, config.rRange = rRange, config);
    		}

    		if ($$self.$$.dirty[3] & /*percentRange*/ 262144) {
    			set_store_value(_percentRange, $_percentRange = percentRange, $_percentRange);
    		}

    		if ($$self.$$.dirty[0] & /*containerWidth*/ 1) {
    			set_store_value(_containerWidth, $_containerWidth = containerWidth, $_containerWidth);
    		}

    		if ($$self.$$.dirty[0] & /*containerHeight*/ 2) {
    			set_store_value(_containerHeight, $_containerHeight = containerHeight, $_containerHeight);
    		}

    		if ($$self.$$.dirty[4] & /*extents*/ 1048576) {
    			set_store_value(_extents, $_extents = filterObject(extents), $_extents);
    		}

    		if ($$self.$$.dirty[3] & /*data*/ 33554432) {
    			set_store_value(_data, $_data = data, $_data);
    		}

    		if ($$self.$$.dirty[3] & /*data*/ 33554432 | $$self.$$.dirty[4] & /*flatData*/ 2097152) {
    			set_store_value(_flatData, $_flatData = flatData || data, $_flatData);
    		}

    		if ($$self.$$.dirty[4] & /*padding*/ 524288) {
    			set_store_value(_padding, $_padding = padding, $_padding);
    		}

    		if ($$self.$$.dirty[3] & /*x*/ 2097152) {
    			set_store_value(_x, $_x = makeAccessor(x), $_x);
    		}

    		if ($$self.$$.dirty[3] & /*y*/ 4194304) {
    			set_store_value(_y, $_y = makeAccessor(y), $_y);
    		}

    		if ($$self.$$.dirty[3] & /*z*/ 8388608) {
    			set_store_value(_z, $_z = makeAccessor(z), $_z);
    		}

    		if ($$self.$$.dirty[3] & /*r*/ 16777216) {
    			set_store_value(_r, $_r = makeAccessor(r), $_r);
    		}

    		if ($$self.$$.dirty[3] & /*xDomain*/ 67108864) {
    			set_store_value(_xDomain, $_xDomain = xDomain, $_xDomain);
    		}

    		if ($$self.$$.dirty[3] & /*yDomain*/ 134217728) {
    			set_store_value(_yDomain, $_yDomain = yDomain, $_yDomain);
    		}

    		if ($$self.$$.dirty[3] & /*zDomain*/ 268435456) {
    			set_store_value(_zDomain, $_zDomain = zDomain, $_zDomain);
    		}

    		if ($$self.$$.dirty[3] & /*rDomain*/ 536870912) {
    			set_store_value(_rDomain, $_rDomain = rDomain, $_rDomain);
    		}

    		if ($$self.$$.dirty[3] & /*xNice*/ 1073741824) {
    			set_store_value(_xNice, $_xNice = xNice, $_xNice);
    		}

    		if ($$self.$$.dirty[4] & /*yNice*/ 1) {
    			set_store_value(_yNice, $_yNice = yNice, $_yNice);
    		}

    		if ($$self.$$.dirty[4] & /*zNice*/ 2) {
    			set_store_value(_zNice, $_zNice = zNice, $_zNice);
    		}

    		if ($$self.$$.dirty[4] & /*rNice*/ 4) {
    			set_store_value(_rNice, $_rNice = rNice, $_rNice);
    		}

    		if ($$self.$$.dirty[4] & /*xReverse*/ 32768) {
    			set_store_value(_xReverse, $_xReverse = xReverse, $_xReverse);
    		}

    		if ($$self.$$.dirty[4] & /*yReverseValue*/ 67108864) {
    			set_store_value(_yReverse, $_yReverse = yReverseValue, $_yReverse);
    		}

    		if ($$self.$$.dirty[4] & /*zReverse*/ 131072) {
    			set_store_value(_zReverse, $_zReverse = zReverse, $_zReverse);
    		}

    		if ($$self.$$.dirty[4] & /*rReverse*/ 262144) {
    			set_store_value(_rReverse, $_rReverse = rReverse, $_rReverse);
    		}

    		if ($$self.$$.dirty[4] & /*xPadding*/ 8) {
    			set_store_value(_xPadding, $_xPadding = xPadding, $_xPadding);
    		}

    		if ($$self.$$.dirty[4] & /*yPadding*/ 16) {
    			set_store_value(_yPadding, $_yPadding = yPadding, $_yPadding);
    		}

    		if ($$self.$$.dirty[4] & /*zPadding*/ 32) {
    			set_store_value(_zPadding, $_zPadding = zPadding, $_zPadding);
    		}

    		if ($$self.$$.dirty[4] & /*rPadding*/ 64) {
    			set_store_value(_rPadding, $_rPadding = rPadding, $_rPadding);
    		}

    		if ($$self.$$.dirty[4] & /*xRange*/ 2048) {
    			set_store_value(_xRange, $_xRange = xRange, $_xRange);
    		}

    		if ($$self.$$.dirty[4] & /*yRange*/ 4096) {
    			set_store_value(_yRange, $_yRange = yRange, $_yRange);
    		}

    		if ($$self.$$.dirty[4] & /*zRange*/ 8192) {
    			set_store_value(_zRange, $_zRange = zRange, $_zRange);
    		}

    		if ($$self.$$.dirty[4] & /*rRange*/ 16384) {
    			set_store_value(_rRange, $_rRange = rRange, $_rRange);
    		}

    		if ($$self.$$.dirty[4] & /*xScale*/ 128) {
    			set_store_value(_xScale, $_xScale = xScale, $_xScale);
    		}

    		if ($$self.$$.dirty[4] & /*yScale*/ 256) {
    			set_store_value(_yScale, $_yScale = yScale, $_yScale);
    		}

    		if ($$self.$$.dirty[4] & /*zScale*/ 512) {
    			set_store_value(_zScale, $_zScale = zScale, $_zScale);
    		}

    		if ($$self.$$.dirty[4] & /*rScale*/ 1024) {
    			set_store_value(_rScale, $_rScale = rScale, $_rScale);
    		}

    		if ($$self.$$.dirty[4] & /*custom*/ 4194304) {
    			set_store_value(_custom, $_custom = custom, $_custom);
    		}

    		if ($$self.$$.dirty[4] & /*config*/ 16777216) {
    			set_store_value(_config, $_config = config, $_config);
    		}

    		if ($$self.$$.dirty[4] & /*context*/ 33554432) {
    			setContext('LayerCake', context);
    		}

    		if ($$self.$$.dirty[0] & /*ssr, $activeGetters_d, $xScale_d, $yScale_d, $zScale_d, $rScale_d*/ 1992 | $$self.$$.dirty[4] & /*$box_d, debug, config*/ 159383552) {
    			if ($box_d && debug === true && (ssr === true || typeof window !== 'undefined')) {
    				// Call this as a debounce so that it doesn't get called multiple times as these vars get filled in
    				printDebug_debounced({
    					boundingBox: $box_d,
    					activeGetters: $activeGetters_d,
    					x: config.x,
    					y: config.y,
    					z: config.z,
    					r: config.r,
    					xScale: $xScale_d,
    					yScale: $yScale_d,
    					zScale: $zScale_d,
    					rScale: $rScale_d
    				});
    			}
    		}
    	};

    	$$invalidate(149, context = {
    		activeGetters: activeGetters_d,
    		width: width_d,
    		height: height_d,
    		percentRange: _percentRange,
    		aspectRatio: aspectRatio_d,
    		containerWidth: _containerWidth,
    		containerHeight: _containerHeight,
    		x: _x,
    		y: _y,
    		z: _z,
    		r: _r,
    		custom: _custom,
    		data: _data,
    		xNice: _xNice,
    		yNice: _yNice,
    		zNice: _zNice,
    		rNice: _rNice,
    		xReverse: _xReverse,
    		yReverse: _yReverse,
    		zReverse: _zReverse,
    		rReverse: _rReverse,
    		xPadding: _xPadding,
    		yPadding: _yPadding,
    		zPadding: _zPadding,
    		rPadding: _rPadding,
    		padding: padding_d,
    		flatData: _flatData,
    		extents: extents_d,
    		xDomain: xDomain_d,
    		yDomain: yDomain_d,
    		zDomain: zDomain_d,
    		rDomain: rDomain_d,
    		xRange: xRange_d,
    		yRange: yRange_d,
    		zRange: zRange_d,
    		rRange: rRange_d,
    		config: _config,
    		xScale: xScale_d,
    		xGet: xGet_d,
    		yScale: yScale_d,
    		yGet: yGet_d,
    		zScale: zScale_d,
    		zGet: zGet_d,
    		rScale: rScale_d,
    		rGet: rGet_d
    	});

    	return [
    		containerWidth,
    		containerHeight,
    		element,
    		ssr,
    		pointerEvents,
    		position,
    		$rScale_d,
    		$zScale_d,
    		$yScale_d,
    		$xScale_d,
    		$activeGetters_d,
    		$_config,
    		$_custom,
    		$_rPadding,
    		$_zPadding,
    		$_yPadding,
    		$_xPadding,
    		$_rReverse,
    		$_zReverse,
    		$_yReverse,
    		$_xReverse,
    		$_rNice,
    		$_zNice,
    		$_yNice,
    		$_xNice,
    		$_r,
    		$_z,
    		$_y,
    		$_x,
    		$_flatData,
    		$_data,
    		$_containerHeight,
    		$_containerWidth,
    		$_percentRange,
    		$width_d,
    		$height_d,
    		$aspectRatio_d,
    		$padding_d,
    		$extents_d,
    		$xDomain_d,
    		$yDomain_d,
    		$zDomain_d,
    		$rDomain_d,
    		$xRange_d,
    		$yRange_d,
    		$zRange_d,
    		$rRange_d,
    		$xGet_d,
    		$yGet_d,
    		$zGet_d,
    		$rGet_d,
    		_percentRange,
    		_containerWidth,
    		_containerHeight,
    		_extents,
    		_data,
    		_flatData,
    		_padding,
    		_x,
    		_y,
    		_z,
    		_r,
    		_xDomain,
    		_yDomain,
    		_zDomain,
    		_rDomain,
    		_xNice,
    		_yNice,
    		_zNice,
    		_rNice,
    		_xReverse,
    		_yReverse,
    		_zReverse,
    		_rReverse,
    		_xPadding,
    		_yPadding,
    		_zPadding,
    		_rPadding,
    		_xRange,
    		_yRange,
    		_zRange,
    		_rRange,
    		_xScale,
    		_yScale,
    		_zScale,
    		_rScale,
    		_config,
    		_custom,
    		activeGetters_d,
    		padding_d,
    		box_d,
    		width_d,
    		height_d,
    		extents_d,
    		xDomain_d,
    		yDomain_d,
    		zDomain_d,
    		rDomain_d,
    		xScale_d,
    		xGet_d,
    		yScale_d,
    		yGet_d,
    		zScale_d,
    		zGet_d,
    		rScale_d,
    		rGet_d,
    		xRange_d,
    		yRange_d,
    		zRange_d,
    		rRange_d,
    		aspectRatio_d,
    		percentRange,
    		width,
    		height,
    		x,
    		y,
    		z,
    		r,
    		data,
    		xDomain,
    		yDomain,
    		zDomain,
    		rDomain,
    		xNice,
    		yNice,
    		zNice,
    		rNice,
    		xPadding,
    		yPadding,
    		zPadding,
    		rPadding,
    		xScale,
    		yScale,
    		zScale,
    		rScale,
    		xRange,
    		yRange,
    		zRange,
    		rRange,
    		xReverse,
    		yReverse,
    		zReverse,
    		rReverse,
    		padding,
    		extents,
    		flatData,
    		custom,
    		debug,
    		config,
    		context,
    		yReverseValue,
    		$box_d,
    		$$scope,
    		slots,
    		div_binding,
    		div_elementresize_handler
    	];
    }

    class LayerCake extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				ssr: 3,
    				pointerEvents: 4,
    				position: 5,
    				percentRange: 111,
    				width: 112,
    				height: 113,
    				containerWidth: 0,
    				containerHeight: 1,
    				element: 2,
    				x: 114,
    				y: 115,
    				z: 116,
    				r: 117,
    				data: 118,
    				xDomain: 119,
    				yDomain: 120,
    				zDomain: 121,
    				rDomain: 122,
    				xNice: 123,
    				yNice: 124,
    				zNice: 125,
    				rNice: 126,
    				xPadding: 127,
    				yPadding: 128,
    				zPadding: 129,
    				rPadding: 130,
    				xScale: 131,
    				yScale: 132,
    				zScale: 133,
    				rScale: 134,
    				xRange: 135,
    				yRange: 136,
    				zRange: 137,
    				rRange: 138,
    				xReverse: 139,
    				yReverse: 140,
    				zReverse: 141,
    				rReverse: 142,
    				padding: 143,
    				extents: 144,
    				flatData: 145,
    				custom: 146,
    				debug: 147
    			},
    			null,
    			[-1, -1, -1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayerCake",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get ssr() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ssr(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get percentRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set percentRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerWidth() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerWidth(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerHeight() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerHeight(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get z() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set z(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get r() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set r(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extents() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extents(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flatData() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flatData(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get custom() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set custom(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get debug() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set debug(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/layercake/dist/layouts/ScaledSvg.svelte generated by Svelte v3.59.2 */
    const file$3 = "node_modules/layercake/dist/layouts/ScaledSvg.svelte";
    const get_default_slot_changes = dirty => ({ element: dirty & /*element*/ 1 });
    const get_default_slot_context = ctx => ({ element: /*element*/ ctx[0] });
    const get_defs_slot_changes = dirty => ({ element: dirty & /*element*/ 1 });
    const get_defs_slot_context = ctx => ({ element: /*element*/ ctx[0] });
    const get_title_slot_changes = dirty => ({ element: dirty & /*element*/ 1 });
    const get_title_slot_context = ctx => ({ element: /*element*/ ctx[0] });

    // (54:20) {#if title}
    function create_if_block$1(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[7]);
    			add_location(title_1, file$3, 53, 31, 2054);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 128) set_data_dev(t, /*title*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(54:20) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (54:20) {#if title}
    function fallback_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[7] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(54:20) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let svg;
    	let defs;
    	let current;
    	const title_slot_template = /*#slots*/ ctx[12].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[11], get_title_slot_context);
    	const title_slot_or_fallback = title_slot || fallback_block(ctx);
    	const defs_slot_template = /*#slots*/ ctx[12].defs;
    	const defs_slot = create_slot(defs_slot_template, ctx, /*$$scope*/ ctx[11], get_defs_slot_context);
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], get_default_slot_context);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (title_slot_or_fallback) title_slot_or_fallback.c();
    			defs = svg_element("defs");
    			if (defs_slot) defs_slot.c();
    			if (default_slot) default_slot.c();
    			add_location(defs, file$3, 55, 1, 2091);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			attr_dev(svg, "preserveAspectRatio", "none");
    			set_style(svg, "right", "0px");
    			set_style(svg, "bottom", "0px");
    			attr_dev(svg, "aria-label", /*label*/ ctx[4]);
    			attr_dev(svg, "aria-labelledby", /*labelledBy*/ ctx[5]);
    			attr_dev(svg, "aria-describedby", /*describedBy*/ ctx[6]);
    			attr_dev(svg, "class", "svelte-6sm8ei");
    			set_style(svg, "z-index", /*zIndex*/ ctx[2]);
    			set_style(svg, "pointer-events", /*pointerEvents*/ ctx[3] === false ? 'none' : null);
    			set_style(svg, "top", /*$padding*/ ctx[8].top + 'px');
    			set_style(svg, "left", /*$padding*/ ctx[8].left + 'px');
    			set_style(svg, "width", `calc(100% - ${/*$padding*/ ctx[8].left + /*$padding*/ ctx[8].right}px)`);
    			set_style(svg, "height", `calc(100% - ${/*$padding*/ ctx[8].top + /*$padding*/ ctx[8].bottom}px)`);
    			add_location(svg, file$3, 38, 0, 1549);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);

    			if (title_slot_or_fallback) {
    				title_slot_or_fallback.m(svg, null);
    			}

    			append_dev(svg, defs);

    			if (defs_slot) {
    				defs_slot.m(defs, null);
    			}

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			/*svg_binding*/ ctx[13](svg);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (title_slot) {
    				if (title_slot.p && (!current || dirty & /*$$scope, element*/ 2049)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[11], dirty, get_title_slot_changes),
    						get_title_slot_context
    					);
    				}
    			} else {
    				if (title_slot_or_fallback && title_slot_or_fallback.p && (!current || dirty & /*title*/ 128)) {
    					title_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (defs_slot) {
    				if (defs_slot.p && (!current || dirty & /*$$scope, element*/ 2049)) {
    					update_slot_base(
    						defs_slot,
    						defs_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(defs_slot_template, /*$$scope*/ ctx[11], dirty, get_defs_slot_changes),
    						get_defs_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, element*/ 2049)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*viewBox*/ 2) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			}

    			if (!current || dirty & /*label*/ 16) {
    				attr_dev(svg, "aria-label", /*label*/ ctx[4]);
    			}

    			if (!current || dirty & /*labelledBy*/ 32) {
    				attr_dev(svg, "aria-labelledby", /*labelledBy*/ ctx[5]);
    			}

    			if (!current || dirty & /*describedBy*/ 64) {
    				attr_dev(svg, "aria-describedby", /*describedBy*/ ctx[6]);
    			}

    			if (dirty & /*zIndex*/ 4) {
    				set_style(svg, "z-index", /*zIndex*/ ctx[2]);
    			}

    			if (dirty & /*pointerEvents*/ 8) {
    				set_style(svg, "pointer-events", /*pointerEvents*/ ctx[3] === false ? 'none' : null);
    			}

    			if (dirty & /*$padding*/ 256) {
    				set_style(svg, "top", /*$padding*/ ctx[8].top + 'px');
    			}

    			if (dirty & /*$padding*/ 256) {
    				set_style(svg, "left", /*$padding*/ ctx[8].left + 'px');
    			}

    			if (dirty & /*$padding*/ 256) {
    				set_style(svg, "width", `calc(100% - ${/*$padding*/ ctx[8].left + /*$padding*/ ctx[8].right}px)`);
    			}

    			if (dirty & /*$padding*/ 256) {
    				set_style(svg, "height", `calc(100% - ${/*$padding*/ ctx[8].top + /*$padding*/ ctx[8].bottom}px)`);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_slot_or_fallback, local);
    			transition_in(defs_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_slot_or_fallback, local);
    			transition_out(defs_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (title_slot_or_fallback) title_slot_or_fallback.d(detaching);
    			if (defs_slot) defs_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*svg_binding*/ ctx[13](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $padding;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScaledSvg', slots, ['title','defs','default']);
    	const { padding } = getContext('LayerCake');
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(8, $padding = value));
    	let { element = undefined } = $$props;
    	let { zIndex = undefined } = $$props;
    	let { pointerEvents = undefined } = $$props;
    	let { fixedAspectRatio = 1 } = $$props;
    	let { viewBox = `0 0 100 ${100 / fixedAspectRatio}` } = $$props;
    	let { label = undefined } = $$props;
    	let { labelledBy = undefined } = $$props;
    	let { describedBy = undefined } = $$props;
    	let { title = undefined } = $$props;

    	const writable_props = [
    		'element',
    		'zIndex',
    		'pointerEvents',
    		'fixedAspectRatio',
    		'viewBox',
    		'label',
    		'labelledBy',
    		'describedBy',
    		'title'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScaledSvg> was created with unknown prop '${key}'`);
    	});

    	function svg_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('zIndex' in $$props) $$invalidate(2, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(3, pointerEvents = $$props.pointerEvents);
    		if ('fixedAspectRatio' in $$props) $$invalidate(10, fixedAspectRatio = $$props.fixedAspectRatio);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('label' in $$props) $$invalidate(4, label = $$props.label);
    		if ('labelledBy' in $$props) $$invalidate(5, labelledBy = $$props.labelledBy);
    		if ('describedBy' in $$props) $$invalidate(6, describedBy = $$props.describedBy);
    		if ('title' in $$props) $$invalidate(7, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		padding,
    		element,
    		zIndex,
    		pointerEvents,
    		fixedAspectRatio,
    		viewBox,
    		label,
    		labelledBy,
    		describedBy,
    		title,
    		$padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('zIndex' in $$props) $$invalidate(2, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(3, pointerEvents = $$props.pointerEvents);
    		if ('fixedAspectRatio' in $$props) $$invalidate(10, fixedAspectRatio = $$props.fixedAspectRatio);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('label' in $$props) $$invalidate(4, label = $$props.label);
    		if ('labelledBy' in $$props) $$invalidate(5, labelledBy = $$props.labelledBy);
    		if ('describedBy' in $$props) $$invalidate(6, describedBy = $$props.describedBy);
    		if ('title' in $$props) $$invalidate(7, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*fixedAspectRatio*/ 1024) {
    			$$invalidate(1, viewBox = `0 0 100 ${100 / fixedAspectRatio}`);
    		}
    	};

    	return [
    		element,
    		viewBox,
    		zIndex,
    		pointerEvents,
    		label,
    		labelledBy,
    		describedBy,
    		title,
    		$padding,
    		padding,
    		fixedAspectRatio,
    		$$scope,
    		slots,
    		svg_binding
    	];
    }

    class ScaledSvg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			element: 0,
    			zIndex: 2,
    			pointerEvents: 3,
    			fixedAspectRatio: 10,
    			viewBox: 1,
    			label: 4,
    			labelledBy: 5,
    			describedBy: 6,
    			title: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScaledSvg",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get element() {
    		throw new Error("<ScaledSvg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<ScaledSvg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zIndex() {
    		throw new Error("<ScaledSvg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zIndex(value) {
    		throw new Error("<ScaledSvg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<ScaledSvg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<ScaledSvg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixedAspectRatio() {
    		throw new Error("<ScaledSvg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixedAspectRatio(value) {
    		throw new Error("<ScaledSvg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<ScaledSvg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<ScaledSvg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<ScaledSvg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<ScaledSvg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelledBy() {
    		throw new Error("<ScaledSvg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelledBy(value) {
    		throw new Error("<ScaledSvg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get describedBy() {
    		throw new Error("<ScaledSvg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set describedBy(value) {
    		throw new Error("<ScaledSvg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ScaledSvg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ScaledSvg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const epsilon = 1e-12;

    function noop() {}

    function point$3(that, x, y) {
      that._context.bezierCurveTo(
        (2 * that._x0 + that._x1) / 3,
        (2 * that._y0 + that._y1) / 3,
        (that._x0 + 2 * that._x1) / 3,
        (that._y0 + 2 * that._y1) / 3,
        (that._x0 + 4 * that._x1 + x) / 6,
        (that._y0 + 4 * that._y1 + y) / 6
      );
    }

    function Basis(context) {
      this._context = context;
    }

    Basis.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x0 = this._x1 =
        this._y0 = this._y1 = NaN;
        this._point = 0;
      },
      lineEnd: function() {
        switch (this._point) {
          case 3: point$3(this, this._x1, this._y1); // falls through
          case 2: this._context.lineTo(this._x1, this._y1); break;
        }
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; break;
          case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // falls through
          default: point$3(this, x, y); break;
        }
        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
      }
    };

    function Bundle(context, beta) {
      this._basis = new Basis(context);
      this._beta = beta;
    }

    Bundle.prototype = {
      lineStart: function() {
        this._x = [];
        this._y = [];
        this._basis.lineStart();
      },
      lineEnd: function() {
        var x = this._x,
            y = this._y,
            j = x.length - 1;

        if (j > 0) {
          var x0 = x[0],
              y0 = y[0],
              dx = x[j] - x0,
              dy = y[j] - y0,
              i = -1,
              t;

          while (++i <= j) {
            t = i / j;
            this._basis.point(
              this._beta * x[i] + (1 - this._beta) * (x0 + t * dx),
              this._beta * y[i] + (1 - this._beta) * (y0 + t * dy)
            );
          }
        }

        this._x = this._y = null;
        this._basis.lineEnd();
      },
      point: function(x, y) {
        this._x.push(+x);
        this._y.push(+y);
      }
    };

    ((function custom(beta) {

      function bundle(context) {
        return beta === 1 ? new Basis(context) : new Bundle(context, beta);
      }

      bundle.beta = function(beta) {
        return custom(+beta);
      };

      return bundle;
    }))(0.85);

    function point$2(that, x, y) {
      that._context.bezierCurveTo(
        that._x1 + that._k * (that._x2 - that._x0),
        that._y1 + that._k * (that._y2 - that._y0),
        that._x2 + that._k * (that._x1 - x),
        that._y2 + that._k * (that._y1 - y),
        that._x2,
        that._y2
      );
    }

    function Cardinal(context, tension) {
      this._context = context;
      this._k = (1 - tension) / 6;
    }

    Cardinal.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x0 = this._x1 = this._x2 =
        this._y0 = this._y1 = this._y2 = NaN;
        this._point = 0;
      },
      lineEnd: function() {
        switch (this._point) {
          case 2: this._context.lineTo(this._x2, this._y2); break;
          case 3: point$2(this, this._x1, this._y1); break;
        }
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; this._x1 = x, this._y1 = y; break;
          case 2: this._point = 3; // falls through
          default: point$2(this, x, y); break;
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
      }
    };

    ((function custom(tension) {

      function cardinal(context) {
        return new Cardinal(context, tension);
      }

      cardinal.tension = function(tension) {
        return custom(+tension);
      };

      return cardinal;
    }))(0);

    function CardinalClosed(context, tension) {
      this._context = context;
      this._k = (1 - tension) / 6;
    }

    CardinalClosed.prototype = {
      areaStart: noop,
      areaEnd: noop,
      lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
        this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
        this._point = 0;
      },
      lineEnd: function() {
        switch (this._point) {
          case 1: {
            this._context.moveTo(this._x3, this._y3);
            this._context.closePath();
            break;
          }
          case 2: {
            this._context.lineTo(this._x3, this._y3);
            this._context.closePath();
            break;
          }
          case 3: {
            this.point(this._x3, this._y3);
            this.point(this._x4, this._y4);
            this.point(this._x5, this._y5);
            break;
          }
        }
      },
      point: function(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
          case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
          case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
          default: point$2(this, x, y); break;
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
      }
    };

    ((function custom(tension) {

      function cardinal(context) {
        return new CardinalClosed(context, tension);
      }

      cardinal.tension = function(tension) {
        return custom(+tension);
      };

      return cardinal;
    }))(0);

    function CardinalOpen(context, tension) {
      this._context = context;
      this._k = (1 - tension) / 6;
    }

    CardinalOpen.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x0 = this._x1 = this._x2 =
        this._y0 = this._y1 = this._y2 = NaN;
        this._point = 0;
      },
      lineEnd: function() {
        if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0: this._point = 1; break;
          case 1: this._point = 2; break;
          case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
          case 3: this._point = 4; // falls through
          default: point$2(this, x, y); break;
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
      }
    };

    ((function custom(tension) {

      function cardinal(context) {
        return new CardinalOpen(context, tension);
      }

      cardinal.tension = function(tension) {
        return custom(+tension);
      };

      return cardinal;
    }))(0);

    function point$1(that, x, y) {
      var x1 = that._x1,
          y1 = that._y1,
          x2 = that._x2,
          y2 = that._y2;

      if (that._l01_a > epsilon) {
        var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
            n = 3 * that._l01_a * (that._l01_a + that._l12_a);
        x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
        y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
      }

      if (that._l23_a > epsilon) {
        var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
            m = 3 * that._l23_a * (that._l23_a + that._l12_a);
        x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
        y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
      }

      that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
    }

    function CatmullRom(context, alpha) {
      this._context = context;
      this._alpha = alpha;
    }

    CatmullRom.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x0 = this._x1 = this._x2 =
        this._y0 = this._y1 = this._y2 = NaN;
        this._l01_a = this._l12_a = this._l23_a =
        this._l01_2a = this._l12_2a = this._l23_2a =
        this._point = 0;
      },
      lineEnd: function() {
        switch (this._point) {
          case 2: this._context.lineTo(this._x2, this._y2); break;
          case 3: this.point(this._x2, this._y2); break;
        }
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        x = +x, y = +y;

        if (this._point) {
          var x23 = this._x2 - x,
              y23 = this._y2 - y;
          this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
        }

        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; break;
          case 2: this._point = 3; // falls through
          default: point$1(this, x, y); break;
        }

        this._l01_a = this._l12_a, this._l12_a = this._l23_a;
        this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
      }
    };

    ((function custom(alpha) {

      function catmullRom(context) {
        return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
      }

      catmullRom.alpha = function(alpha) {
        return custom(+alpha);
      };

      return catmullRom;
    }))(0.5);

    function CatmullRomClosed(context, alpha) {
      this._context = context;
      this._alpha = alpha;
    }

    CatmullRomClosed.prototype = {
      areaStart: noop,
      areaEnd: noop,
      lineStart: function() {
        this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
        this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
        this._l01_a = this._l12_a = this._l23_a =
        this._l01_2a = this._l12_2a = this._l23_2a =
        this._point = 0;
      },
      lineEnd: function() {
        switch (this._point) {
          case 1: {
            this._context.moveTo(this._x3, this._y3);
            this._context.closePath();
            break;
          }
          case 2: {
            this._context.lineTo(this._x3, this._y3);
            this._context.closePath();
            break;
          }
          case 3: {
            this.point(this._x3, this._y3);
            this.point(this._x4, this._y4);
            this.point(this._x5, this._y5);
            break;
          }
        }
      },
      point: function(x, y) {
        x = +x, y = +y;

        if (this._point) {
          var x23 = this._x2 - x,
              y23 = this._y2 - y;
          this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
        }

        switch (this._point) {
          case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
          case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
          case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
          default: point$1(this, x, y); break;
        }

        this._l01_a = this._l12_a, this._l12_a = this._l23_a;
        this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
      }
    };

    ((function custom(alpha) {

      function catmullRom(context) {
        return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
      }

      catmullRom.alpha = function(alpha) {
        return custom(+alpha);
      };

      return catmullRom;
    }))(0.5);

    function CatmullRomOpen(context, alpha) {
      this._context = context;
      this._alpha = alpha;
    }

    CatmullRomOpen.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x0 = this._x1 = this._x2 =
        this._y0 = this._y1 = this._y2 = NaN;
        this._l01_a = this._l12_a = this._l23_a =
        this._l01_2a = this._l12_2a = this._l23_2a =
        this._point = 0;
      },
      lineEnd: function() {
        if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        x = +x, y = +y;

        if (this._point) {
          var x23 = this._x2 - x,
              y23 = this._y2 - y;
          this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
        }

        switch (this._point) {
          case 0: this._point = 1; break;
          case 1: this._point = 2; break;
          case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
          case 3: this._point = 4; // falls through
          default: point$1(this, x, y); break;
        }

        this._l01_a = this._l12_a, this._l12_a = this._l23_a;
        this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
      }
    };

    ((function custom(alpha) {

      function catmullRom(context) {
        return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
      }

      catmullRom.alpha = function(alpha) {
        return custom(+alpha);
      };

      return catmullRom;
    }))(0.5);

    function sign(x) {
      return x < 0 ? -1 : 1;
    }

    // Calculate the slopes of the tangents (Hermite-type interpolation) based on
    // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
    // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
    // NOV(II), P. 443, 1990.
    function slope3(that, x2, y2) {
      var h0 = that._x1 - that._x0,
          h1 = x2 - that._x1,
          s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
          s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
          p = (s0 * h1 + s1 * h0) / (h0 + h1);
      return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
    }

    // Calculate a one-sided slope.
    function slope2(that, t) {
      var h = that._x1 - that._x0;
      return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
    }

    // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
    // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
    // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
    function point(that, t0, t1) {
      var x0 = that._x0,
          y0 = that._y0,
          x1 = that._x1,
          y1 = that._y1,
          dx = (x1 - x0) / 3;
      that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
    }

    function MonotoneX(context) {
      this._context = context;
    }

    MonotoneX.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x0 = this._x1 =
        this._y0 = this._y1 =
        this._t0 = NaN;
        this._point = 0;
      },
      lineEnd: function() {
        switch (this._point) {
          case 2: this._context.lineTo(this._x1, this._y1); break;
          case 3: point(this, this._t0, slope2(this, this._t0)); break;
        }
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        var t1 = NaN;

        x = +x, y = +y;
        if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; break;
          case 2: this._point = 3; point(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
          default: point(this, this._t0, t1 = slope3(this, x, y)); break;
        }

        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
        this._t0 = t1;
      }
    };

    (Object.create(MonotoneX.prototype)).point = function(x, y) {
      MonotoneX.prototype.point.call(this, y, x);
    };

    /* src/components/DatawrapperGraphic.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$2 = "src/components/DatawrapperGraphic.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let iframe;
    	let iframe_title_value;
    	let iframe_src_value;
    	let div_id_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			iframe = element("iframe");
    			attr_dev(iframe, "title", iframe_title_value = /*graphic*/ ctx[0].alt);
    			if (!src_url_equal(iframe.src, iframe_src_value = createIframeSrc(/*graphic*/ ctx[0].url))) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    			iframe.allowFullscreen = true;
    			attr_dev(iframe, "class", "svelte-d46akx");
    			add_location(iframe, file$2, 17, 2, 454);
    			attr_dev(div, "class", "graphic-container svelte-d46akx");
    			attr_dev(div, "id", div_id_value = /*graphic*/ ctx[0].id);
    			add_location(div, file$2, 16, 0, 404);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, iframe);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*graphic*/ 1 && iframe_title_value !== (iframe_title_value = /*graphic*/ ctx[0].alt)) {
    				attr_dev(iframe, "title", iframe_title_value);
    			}

    			if (dirty & /*graphic*/ 1 && !src_url_equal(iframe.src, iframe_src_value = createIframeSrc(/*graphic*/ ctx[0].url))) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}

    			if (dirty & /*graphic*/ 1 && div_id_value !== (div_id_value = /*graphic*/ ctx[0].id)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function createIframeSrc(url) {
    	// Extract just the necessary parts of the URL to create a secure embed
    	try {
    		const urlObj = new URL(url);
    		return `${urlObj.origin}${urlObj.pathname}${urlObj.search}`;
    	} catch(e) {
    		console.error("Invalid URL:", url);
    		return '';
    	}
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DatawrapperGraphic', slots, []);
    	let { graphic } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (graphic === undefined && !('graphic' in $$props || $$self.$$.bound[$$self.$$.props['graphic']])) {
    			console_1.warn("<DatawrapperGraphic> was created without expected prop 'graphic'");
    		}
    	});

    	const writable_props = ['graphic'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<DatawrapperGraphic> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('graphic' in $$props) $$invalidate(0, graphic = $$props.graphic);
    	};

    	$$self.$capture_state = () => ({ graphic, createIframeSrc });

    	$$self.$inject_state = $$props => {
    		if ('graphic' in $$props) $$invalidate(0, graphic = $$props.graphic);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [graphic];
    }

    class DatawrapperGraphic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { graphic: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DatawrapperGraphic",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get graphic() {
    		throw new Error("<DatawrapperGraphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set graphic(value) {
    		throw new Error("<DatawrapperGraphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/VisualizationWrapper.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/components/VisualizationWrapper.svelte";

    // (21:2) {#if graphic}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*useLayerCake*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(21:2) {#if graphic}",
    		ctx
    	});

    	return block;
    }

    // (25:4) {:else}
    function create_else_block(ctx) {
    	let div;
    	let layercake;
    	let current;

    	const layercake_spread_levels = [
    		{ data: /*chartData*/ ctx[1] },
    		{ x: func },
    		{ y: func_1 },
    		{
    			padding: { top: 20, right: 20, bottom: 30, left: 40 }
    		},
    		/*dimensions*/ ctx[2]
    	];

    	let layercake_props = {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < layercake_spread_levels.length; i += 1) {
    		layercake_props = assign(layercake_props, layercake_spread_levels[i]);
    	}

    	layercake = new LayerCake({ props: layercake_props, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(layercake.$$.fragment);
    			attr_dev(div, "class", "layercake-container svelte-13wdq00");
    			add_location(div, file$1, 26, 6, 815);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(layercake, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layercake_changes = (dirty & /*chartData, dimensions*/ 6)
    			? get_spread_update(layercake_spread_levels, [
    					dirty & /*chartData*/ 2 && { data: /*chartData*/ ctx[1] },
    					layercake_spread_levels[1],
    					layercake_spread_levels[2],
    					layercake_spread_levels[3],
    					dirty & /*dimensions*/ 4 && get_spread_object(/*dimensions*/ ctx[2])
    				])
    			: {};

    			if (dirty & /*$$scope, graphic*/ 17) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(layercake);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(25:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:4) {#if !useLayerCake}
    function create_if_block_1(ctx) {
    	let datawrappergraphic;
    	let current;

    	datawrappergraphic = new DatawrapperGraphic({
    			props: { graphic: /*graphic*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(datawrappergraphic.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(datawrappergraphic, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const datawrappergraphic_changes = {};
    			if (dirty & /*graphic*/ 1) datawrappergraphic_changes.graphic = /*graphic*/ ctx[0];
    			datawrappergraphic.$set(datawrappergraphic_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datawrappergraphic.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datawrappergraphic.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(datawrappergraphic, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(22:4) {#if !useLayerCake}",
    		ctx
    	});

    	return block;
    }

    // (35:10) <ScaledSvg>
    function create_default_slot_1(ctx) {
    	let datawrappergraphic;
    	let current;

    	datawrappergraphic = new DatawrapperGraphic({
    			props: { graphic: /*graphic*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(datawrappergraphic.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(datawrappergraphic, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const datawrappergraphic_changes = {};
    			if (dirty & /*graphic*/ 1) datawrappergraphic_changes.graphic = /*graphic*/ ctx[0];
    			datawrappergraphic.$set(datawrappergraphic_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datawrappergraphic.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datawrappergraphic.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(datawrappergraphic, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(35:10) <ScaledSvg>",
    		ctx
    	});

    	return block;
    }

    // (28:8) <LayerCake           data={chartData}           x={d => d.x}           y={d => d.y}           padding={{ top: 20, right: 20, bottom: 30, left: 40 }}           {...dimensions}         >
    function create_default_slot(ctx) {
    	let scaledsvg;
    	let current;

    	scaledsvg = new ScaledSvg({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(scaledsvg.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(scaledsvg, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const scaledsvg_changes = {};

    			if (dirty & /*$$scope, graphic*/ 17) {
    				scaledsvg_changes.$$scope = { dirty, ctx };
    			}

    			scaledsvg.$set(scaledsvg_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scaledsvg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scaledsvg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scaledsvg, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(28:8) <LayerCake           data={chartData}           x={d => d.x}           y={d => d.y}           padding={{ top: 20, right: 20, bottom: 30, left: 40 }}           {...dimensions}         >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	let if_block = /*graphic*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "visualization-container svelte-13wdq00");
    			add_location(div, file$1, 19, 0, 549);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*graphic*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*graphic*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = d => d.x;
    const func_1 = d => d.y;

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VisualizationWrapper', slots, []);
    	let { graphic } = $$props;

    	// You can add any data transformations or additional data here
    	// that LayerCake might need for supplemental visualizations
    	let chartData = [];

    	// Define dimensions for the visualization
    	const dimensions = {
    		width: window.innerWidth * 0.8,
    		height: window.innerHeight * 0.7
    	};

    	let useLayerCake = false; // Set to true to use LayerCake instead of direct embed

    	$$self.$$.on_mount.push(function () {
    		if (graphic === undefined && !('graphic' in $$props || $$self.$$.bound[$$self.$$.props['graphic']])) {
    			console.warn("<VisualizationWrapper> was created without expected prop 'graphic'");
    		}
    	});

    	const writable_props = ['graphic'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VisualizationWrapper> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('graphic' in $$props) $$invalidate(0, graphic = $$props.graphic);
    	};

    	$$self.$capture_state = () => ({
    		LayerCake,
    		ScaledSvg,
    		DatawrapperGraphic,
    		graphic,
    		chartData,
    		dimensions,
    		useLayerCake
    	});

    	$$self.$inject_state = $$props => {
    		if ('graphic' in $$props) $$invalidate(0, graphic = $$props.graphic);
    		if ('chartData' in $$props) $$invalidate(1, chartData = $$props.chartData);
    		if ('useLayerCake' in $$props) $$invalidate(3, useLayerCake = $$props.useLayerCake);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [graphic, chartData, dimensions, useLayerCake];
    }

    class VisualizationWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { graphic: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VisualizationWrapper",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get graphic() {
    		throw new Error("<VisualizationWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set graphic(value) {
    		throw new Error("<VisualizationWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (68:4) 
    function create_background_slot(ctx) {
    	let div;
    	let visualizationwrapper;
    	let current;

    	visualizationwrapper = new VisualizationWrapper({
    			props: { graphic: /*activeGraphic*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(visualizationwrapper.$$.fragment);
    			attr_dev(div, "slot", "background");
    			add_location(div, file, 67, 4, 2212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(visualizationwrapper, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const visualizationwrapper_changes = {};
    			if (dirty & /*activeGraphic*/ 2) visualizationwrapper_changes.graphic = /*activeGraphic*/ ctx[1];
    			visualizationwrapper.$set(visualizationwrapper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(visualizationwrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(visualizationwrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(visualizationwrapper);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_background_slot.name,
    		type: "slot",
    		source: "(68:4) ",
    		ctx
    	});

    	return block;
    }

    // (73:6) {#each sections as section, i}
    function create_each_block(ctx) {
    	let section;
    	let current;

    	section = new Section({
    			props: {
    				id: /*section*/ ctx[7].id,
    				title: /*section*/ ctx[7].title,
    				text: /*section*/ ctx[7].text,
    				isActive: /*i*/ ctx[9] === /*activeSection*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const section_changes = {};
    			if (dirty & /*activeSection*/ 1) section_changes.isActive = /*i*/ ctx[9] === /*activeSection*/ ctx[0];
    			section.$set(section_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(73:6) {#each sections as section, i}",
    		ctx
    	});

    	return block;
    }

    // (72:4) 
    function create_foreground_slot(ctx) {
    	let div;
    	let current;
    	let each_value = /*sections*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "slot", "foreground");
    			add_location(div, file, 71, 4, 2311);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sections, activeSection*/ 5) {
    				each_value = /*sections*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_foreground_slot.name,
    		type: "slot",
    		source: "(72:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let scroller;
    	let updating_activeSection;
    	let current;

    	function scroller_activeSection_binding(value) {
    		/*scroller_activeSection_binding*/ ctx[4](value);
    	}

    	let scroller_props = {
    		$$slots: {
    			foreground: [create_foreground_slot],
    			background: [create_background_slot]
    		},
    		$$scope: { ctx }
    	};

    	if (/*activeSection*/ ctx[0] !== void 0) {
    		scroller_props.activeSection = /*activeSection*/ ctx[0];
    	}

    	scroller = new Scroller({ props: scroller_props, $$inline: true });
    	binding_callbacks.push(() => bind(scroller, 'activeSection', scroller_activeSection_binding));
    	scroller.$on("sectionChange", /*sectionChange_handler*/ ctx[5]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(scroller.$$.fragment);
    			attr_dev(main, "class", "svelte-1w5myez");
    			add_location(main, file, 65, 0, 2099);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(scroller, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scroller_changes = {};

    			if (dirty & /*$$scope, activeSection, activeGraphic*/ 1027) {
    				scroller_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_activeSection && dirty & /*activeSection*/ 1) {
    				updating_activeSection = true;
    				scroller_changes.activeSection = /*activeSection*/ ctx[0];
    				add_flush_callback(() => updating_activeSection = false);
    			}

    			scroller.$set(scroller_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scroller.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scroller.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(scroller);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const graphics = [
    		{
    			id: 'graphic-1',
    			url: 'https://datawrapper.dwcdn.net/rtCXv/1/',
    			alt: 'Description of your first visualization',
    			title: 'First Visualization'
    		},
    		{
    			id: 'graphic-2',
    			url: 'https://datawrapper.dwcdn.net/rtCXv/1/',
    			alt: 'Description of your second visualization',
    			title: 'Second Visualization'
    		}
    	];

    	// Text sections that will scroll alongside graphics
    	const sections = [
    		{
    			id: 'section-1',
    			title: 'First Section',
    			text: 'This is the first section of your scrollytelling experience. As the user scrolls, this text will move while the graphic stays fixed.',
    			graphicId: 'graphic-1'
    		},
    		{
    			id: 'section-2',
    			title: 'Second Section',
    			text: 'As the user continues to scroll, new text appears. The graphic remains the same until we reach a transition point.',
    			graphicId: 'graphic-1'
    		},
    		{
    			id: 'section-3',
    			title: 'Third Section',
    			text: 'Now we transition to a new graphic as this text scrolls into view. The previous graphic and its associated text have moved off screen.',
    			graphicId: 'graphic-2'
    		},
    		{
    			id: 'section-4',
    			title: 'Fourth Section',
    			text: 'The final section continues with the second graphic. After this, both will lock and move off screen together.',
    			graphicId: 'graphic-2'
    		}
    	];

    	let activeSection = 0;
    	let activeGraphic = graphics[0];

    	// Update the active section and corresponding graphic
    	function updateActiveSection(index) {
    		$$invalidate(0, activeSection = index);

    		// Find the corresponding graphic for this section
    		const section = sections[index];

    		const graphicObj = graphics.find(g => g.id === section.graphicId);

    		if (graphicObj) {
    			$$invalidate(1, activeGraphic = graphicObj);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function scroller_activeSection_binding(value) {
    		activeSection = value;
    		$$invalidate(0, activeSection);
    	}

    	const sectionChange_handler = e => updateActiveSection(e.detail);

    	$$self.$capture_state = () => ({
    		onMount,
    		Scroller,
    		Section,
    		VisualizationWrapper,
    		graphics,
    		sections,
    		activeSection,
    		activeGraphic,
    		updateActiveSection
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeSection' in $$props) $$invalidate(0, activeSection = $$props.activeSection);
    		if ('activeGraphic' in $$props) $$invalidate(1, activeGraphic = $$props.activeGraphic);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		activeSection,
    		activeGraphic,
    		sections,
    		updateActiveSection,
    		scroller_activeSection_binding,
    		sectionChange_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
