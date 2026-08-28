import { Link } from "@tanstack/react-router";
import { SiteChrome } from "./site-chrome";
import {
  fieldRecipes,
  TOOL_EXPLAIN,
  TOOL_LABEL,
  TOOL_LEGEND,
  type FieldRecipe,
  type RecipeTool,
} from "./field-guide-data";

function RecipeToolChip({
  tool,
  tipId,
}: {
  tool: RecipeTool;
  tipId: string;
}) {
  const explain = TOOL_EXPLAIN[tool];
  return (
    <button
      type="button"
      className={`ac-recipe-tool ac-recipe-tool--${tool}`}
      aria-describedby={tipId}
    >
      {TOOL_LABEL[tool]}
      <span className="ac-recipe-tip" id={tipId} role="tooltip">
        <span className="ac-recipe-tip-k">{explain.kicker}</span>
        <span className="ac-recipe-tip-what">{explain.what}</span>
        <span className="ac-recipe-tip-how">{explain.how}</span>
      </span>
    </button>
  );
}

function RecipeCard({ recipe }: { recipe: FieldRecipe }) {
  return (
    <article className="ac-recipe" id={recipe.id}>
      <header className="ac-recipe-head">
        <span className="ac-recipe-num">{recipe.number}</span>
        <div className="ac-recipe-titles">
          <h2 className="ac-recipe-title">{recipe.title}</h2>
          <p className="ac-recipe-when">{recipe.when}</p>
        </div>
        <RecipeToolChip tool={recipe.tool} tipId={`fg-tip-${recipe.id}`} />
      </header>
      <ol className="ac-recipe-steps">
        {recipe.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="ac-recipe-done">
        <span>Done when</span>
        {recipe.doneWhen}
      </p>
    </article>
  );
}

export function FieldGuidePage() {
  return (
    <SiteChrome loginRedirect="/gnomah">
      <div className="ac-service-page ac-field-guide ac-page-top">
        <div className="ac-service-stack">
          <header className="ac-service-head">
            <span className="ac-service-kicker">Field guide</span>
            <h1 className="ac-service-title">Recipes for the climb</h1>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede">
                Climb Notes™ are the journal — finished climbs, published.
                This is the field manual: eight short recipes so a shop
                owner and an engineer can take the same next pitch.
              </p>
              <p className="ac-service-lede ac-service-lede--last">
                We build this way now, and we will keep building this way.
                Climb Note first. Tool second. Hover a chip — that is the
                kit.
              </p>
            </div>
            <ul className="ac-recipe-legend" aria-label="The kit">
              {TOOL_LEGEND.map((tool) => (
                <li key={tool}>
                  <RecipeToolChip
                    tool={tool}
                    tipId={`fg-tip-legend-${tool}`}
                  />
                </li>
              ))}
            </ul>
          </header>

          <div className="ac-recipe-list">
            {fieldRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          <p className="ac-field-guide-foot">
            <Link to="/start">Send a Climb Note</Link>
            <span aria-hidden> · </span>
            <Link to="/climb-notes">Read published Climb Notes</Link>
            <span aria-hidden> · </span>
            <Link to="/service">How we help you climb</Link>
          </p>
        </div>
      </div>
    </SiteChrome>
  );
}