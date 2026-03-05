export function Usage() {
	return (
		<section className="py-20">
			<h2 className="text-2xl font-semibold text-zinc-50 mb-2">Usage</h2>
			<p className="text-zinc-500 mb-10">Works with any framework — or none at all.</p>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
					<h3 className="text-sm font-medium text-zinc-400 mb-4">Vanilla HTML</h3>
					<pre className="text-sm text-zinc-300 font-mono leading-relaxed overflow-x-auto">
						<code>{`<script type="module">
  import { register } from 'glow-card';
  register();
</script>

<glow-card variant="border">
  <div class="card">Hello World</div>
</glow-card>`}</code>
					</pre>
				</div>

				<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
					<h3 className="text-sm font-medium text-zinc-400 mb-4">React</h3>
					<pre className="text-sm text-zinc-300 font-mono leading-relaxed overflow-x-auto">
						<code>{`import { GlowCard } from 'glow-card/react';

<GlowCard
  variant="border"
  color="#6366f1"
>
  <div className="card">
    Hello World
  </div>
</GlowCard>`}</code>
					</pre>
				</div>
			</div>
		</section>
	);
}
